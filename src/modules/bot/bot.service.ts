import {Injectable, Logger} from "@nestjs/common";
import { EFriendRelationship, ETradeOfferState } from "steam-user";
import * as totp from 'steam-totp'

import {Steam} from "../../class/Steam";
import {CommandEmitter} from "../../class/CommandEmitter";
import {PricesCommand} from "./commands/prices.command";
import {Command} from "../../class/Command";
import {HelpCommand} from "./commands/help.command";
import {SellCommand} from "./commands/sell.command";
import { SteamApis } from "../../class/SteamApis";
import { CurrencyCommand } from "./commands/currency.command";
import { Cron } from "@nestjs/schedule";

import { subHours } from 'date-fns'
import { ActiveOfferProcess } from "./processes/active.offer.process";
import { AcceptedOfferProcess } from "./processes/accepted.offer.process";
import { BuyCommand } from "./commands/buy.command";

@Injectable()
export class BotService {
    private client: Steam
    private emitter: CommandEmitter

    constructor() {
        let api_provider = new SteamApis('ap3KuvXvhDEAepbgXvxvRik60cY')

        this.client = new Steam('k0N4WNsYs+RYsIfSeJTDZ8FYjGI=', api_provider)
        this.emitter = CommandEmitter.getInstance()

        this.client.logOn({
            accountName: 'oragok15004',
            password: '6YGwBTWDRe5JsRT6',
            twoFactorCode: totp.getAuthCode('7EwOed6tG/xtZQLz5DE+qMmnPlo=')
        })

        this.client.on('loggedOn', (details) => {
            Logger.debug("Logged in!")
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
                await this.client.chat.sendFriendMessage(msg.steamid_friend, `Error ${e} while processing command, use /help`)
            }
        })


        this.emitter.registerCommand(new PricesCommand())
        this.emitter.registerCommand(new HelpCommand())
        this.emitter.registerCommand(new CurrencyCommand())
        this.emitter.registerCommand(new SellCommand())
        this.emitter.registerCommand(new BuyCommand())
    }

    @Cron('0 * * * * *')
    async checkOffers() {
        Logger.debug('Check offers cron')
        let cutoff = subHours(new Date(), 6)
        let offers = await this.client.getSentOffers(cutoff)
        offers = offers.filter(offer => offer.message.length > 0)

        let accepted = offers.filter(offer => offer.state == ETradeOfferState.Accepted)
        let active = offers.filter(offer => offer.state == ETradeOfferState.Active)

        for (let offer of accepted) {
            try {
                await AcceptedOfferProcess.run(offer, this.client)
            } catch (e) {
                await this.client.chat.sendFriendMessage(offer.partner, `${e} while processing accepted offer`)
            }
        }

        for (let offer of active) {
            try {
                await ActiveOfferProcess.run(offer, this.client)
            } catch (e) {
                await this.client.chat.sendFriendMessage(offer.partner, `${e} while processing active offer`)
            }
        }
    }
}