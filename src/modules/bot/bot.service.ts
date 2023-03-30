import {Injectable, Logger} from "@nestjs/common";
import { EFriendRelationship, ETradeOfferState } from "steam-user";
import * as totp from 'steam-totp'

import {Steam} from "../../class/steam/Steam";
import {CommandEmitter} from "../../class/CommandEmitter";
import {Command} from "../../class/Command";
import {HelpCommand} from "./commands/help.command";
import {SellCommand} from "./commands/sell.command";
import { SteamApis } from "../../class/steam/SteamApis";
import { StocksCommand } from "./commands/stocks.command";
import { Cron } from "@nestjs/schedule";

import { subMinutes } from 'date-fns'
import { ActiveOfferProcess } from "./processes/active.offer.process";
import { AcceptedOfferProcess } from "./processes/accepted.offer.process";
import { BuyCommand } from "./commands/buy.command";
import { BitCart } from "../../class/payproc/BitCart";
import { Constants } from "../../class/Constants";

@Injectable()
export class BotService {
    private client: Steam
    private emitter: CommandEmitter

    constructor() {
        let api_provider = new SteamApis(Constants.STEAM_APIS.API_KEY)
        let bitcart = new BitCart(Constants.BITCART.CART_HOST, Constants.BITCART.API_KEY, Constants.BITCART.STORE_ID)

        this.client = new Steam(Constants.STEAM.IDENTITY_SECRET, api_provider, bitcart)
        this.emitter = CommandEmitter.getInstance()

        this.client.logOn({
            accountName: Constants.STEAM.LOGIN,
            password: Constants.STEAM.PASSWORD,
            twoFactorCode: totp.getAuthCode(Constants.STEAM.SHARED_SECRET)
        })

        this.client.on('loggedOn', async (details) => {
            Logger.debug("Logged in!")
            // await this.client.updateStocks()
        })

        this.client.on('newItems', async () => {
            await this.client.updateStocks()
        })

        this.client.on('friendRelationship', async (steamid, relationship) => {
            Logger.debug(`New friend relationship ${EFriendRelationship[relationship]} with ${steamid}`)
            if (relationship == EFriendRelationship.RequestRecipient) {
                let {personaName} = await this.client.addFriend(steamid)
                Logger.debug(`Accepted ${personaName}#${steamid} request`)
            }
        })

        this.client.chat.on('friendMessage', async (msg) => {
            try {
                let cmd = Command.parseCommand(msg.message)
                this.emitter.runCommand(cmd, this.client, msg.steamid_friend.toString())
            } catch (e) {
                await this.client.quoteMessage(msg.steamid_friend.getSteamID64(), `Error ${e} while processing command, use /help`)
            }
        })


        this.emitter.registerCommand(new HelpCommand())
        this.emitter.registerCommand(new StocksCommand())
        this.emitter.registerCommand(new SellCommand())
        this.emitter.registerCommand(new BuyCommand())
    }

    @Cron('0 * * * * *')
    async checkOffers() {
        let cutoff = subMinutes(new Date(), 5)
        let { sent, received } = await this.client.getOffers(cutoff)
        sent = sent.filter(offer => offer.message.length > 0)

        let accepted = sent.filter(offer => offer.state == ETradeOfferState.Accepted)
        let active = sent.filter(offer => offer.state == ETradeOfferState.Active)

        for (let offer of accepted) {
            try {
                await AcceptedOfferProcess.run(offer, this.client)
            } catch (e) {
                await this.client.quoteMessage(offer.partner.getSteamID64(), `${e} while processing accepted offer`)
            }
        }

        for (let offer of active) {
            try {
                await ActiveOfferProcess.run(offer, this.client)
            } catch (e) {
                await this.client.quoteMessage(offer.partner.getSteamID64(), `${e} while processing active offer`)
            }
        }

        active = received.filter(offer => offer.state == ETradeOfferState.Active)
        for (let offer of active) {
            if (Constants.ADMINS.includes(offer.partner.getSteamID64())) {
                await this.client.acceptOffer(offer)
            } else await this.client.cancelOffer(offer)
        }
    }

    @Cron('0 * * * * *')
    async checkPayments() {
        let invoices = await this.client.payment_provider.getPaidInvoices()
        for (let invoice of invoices) {
            Logger.debug(`Working with #${invoice.id} invoice`)
            await this.client.sendKeys(invoice.metadata.steamid, invoice.metadata.amount, 'From papa with love :3')
            if (await this.client.payment_provider.completeInvoice(invoice))
                Logger.debug(`Invoice #${invoice.id} completed`)
            else Logger.error(`ERROR WHILE COMPLETING #${invoice.id} invoice!!`)
        }
    }
}