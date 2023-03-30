import * as SteamUser from "steam-user";
import { EPersonaState } from "steam-user";
import * as SteamCommunity from "steamcommunity";
import * as SteamTradeOfferManager from "steam-tradeoffer-manager";
import { App } from "../../enum/App";
import { TF2Item } from "../../enum/TF2Item";
import { NoEnoughItemsException } from "../../exceptions/Steam";
import { TradeOffer } from "../../interface/TradeOffer";
import { Item } from "../Item";
import { SteamAPIProvider } from "../../interface/SteamAPIProvider";
import { PaymentProcessor } from "../../interface/PaymentProcessor";
import { KeyPrice } from "./KeyPrice";

interface SteamInventory {
    success: number
    assets: {
        classid: string
        assetid: string
    }[]
}

enum EOfferFilter {
    ActiveOnly = 1,
    HistoricalOnly = 2,
    All = 3
}

export class Steam extends SteamUser {
    community: SteamCommunity
    manager: SteamTradeOfferManager
    identity_secret: string
    api_provider: SteamAPIProvider
    payment_provider: PaymentProcessor

    constructor(identity_secret: string, api_provider: SteamAPIProvider, payment_provider: PaymentProcessor) {
        super();

        this.community = new SteamCommunity()
        this.manager = new SteamTradeOfferManager({
            "steam": this,
            "domain": "example.com",
            "language": "en"
        })

        this.identity_secret = identity_secret
        this.api_provider = api_provider
        this.payment_provider = payment_provider

        this.on('webSession', async (sessionid, cookies) => {
            this.community.setCookies(cookies)
            this.manager.setCookies(cookies)

            this.community.startConfirmationChecker(30_000, this.identity_secret)
        })
    }

    private get(url: string) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.community.httpRequestGet({
                "uri": url,
                "json": true
            }, (err, response, body) => {
                if (err)
                    return reject(err)

                resolve(body)
            })
        })
    }

    private sendOffer(trade_offer: any) : Promise<string> {
        return new Promise((resolve, reject) => {
            trade_offer.send((err, status) => {
                
                if (err)
                    return reject(err)

                resolve(status)
            })
        })
    }

    private getApiKey(domain: string) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.community.getWebApiKey(domain, (err, key) => {
                if (err)
                    return reject(err)

                resolve(key)
            })
        })
    }

    public async updateStocks() : Promise<void> {
        let keys = await this.getKeys(this.steamID.getSteamID64())
        this.gamesPlayed(`$${KeyPrice.getBuyPrice()}/$${KeyPrice.getSellPrice()}, ${keys.length}/3000🔑`)
        this.setPersona(EPersonaState.Online)
    }

    public getOffers(cutoff: Date) : Promise<{sent: TradeOffer[], received: TradeOffer[]}> {
        return new Promise<{sent: TradeOffer[], received: TradeOffer[]}>((resolve, reject) => {
            this.manager.getOffers(EOfferFilter.ActiveOnly, cutoff, (err, sent, received) => {
                if (err)
                    return reject(err)

                resolve({ sent, received })
            })
        })
    }

    public cancelOffer(trade_offer: any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            trade_offer.cancel((err) => {
                if (err)
                    return reject(err)

                return resolve()
            })
        })
    }

    public acceptOffer(trade_offer: any) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            trade_offer.accept(true, () => {
                resolve()
            })
        })
    }

    public async getKeys(steamid: string) : Promise<Item[]> {
        let inventory = await this.api_provider.getInventory(steamid, App.TF2)
        let keys = this.api_provider.getItemFromInventory(inventory, TF2Item.Key)

        return keys
    }

    public async retreiveKeys(steamid: string, amount: number, message: string = '') : Promise<void> {
        let keys = await this.getKeys(steamid)

        if (amount > keys.length || amount <= 0)
            throw new NoEnoughItemsException()

        let trade_offer: TradeOffer = this.manager.createOffer(steamid)
        trade_offer.addTheirItems(keys.slice(0, amount))
        trade_offer.setMessage(message)

        await this.sendOffer(trade_offer)
        await this.quoteMessage(steamid, 'Trade offer successfully sent!')
    }

    public async sendKeys(steamid: string, amount: number, message: string = '') : Promise<void> {
        let keys = await this.getKeys(this.steamID.getSteamID64())

        if (amount > keys.length || amount <= 0)
            throw new NoEnoughItemsException()

        let trade_offer: TradeOffer = this.manager.createOffer(steamid)
        trade_offer.addMyItems(keys.slice(0, amount))
        trade_offer.setMessage(message)

        await this.sendOffer(trade_offer)
        await this.quoteMessage(steamid, 'Trade offer successfully sent, wait while bot confirm!')
    }


    public async quoteMessage(steamid: string, message: string) : Promise<void> {
        await this.chat.sendFriendMessage(steamid, `/quote ${message}`)
    }

    public async preMessage(steamid: string, message: string) : Promise<void> {
        await this.chat.sendFriendMessage(steamid, `/pre ${message}`)
    }
}