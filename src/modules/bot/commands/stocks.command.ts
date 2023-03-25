import {Command} from "../../../class/Command";
import {Steam} from "../../../class/steam/Steam";
import {CommandProcessor} from "../../../interface/CommandProcessor";
import {Logger} from "@nestjs/common";
import {Argument} from "../../../class/Argument";
import { KeyPrice } from "../../../class/steam/KeyPrice";
import { SteamApis } from "../../../class/steam/SteamApis";
import { App } from "../../../enum/App";
import { TF2Item } from "../../../enum/TF2Item";

export class StocksCommand implements CommandProcessor {
    public name = 'stocks'
    public arguments: Argument[] = []
    public description = 'show stocks'
    public example = '/stocks'


    async process(cmd: Command, client: Steam, steamid: string) {
        await client.chat.sendFriendMessage(steamid, `Collecting information, wait a bit...`)

        let wallets = await client.payment_provider.getWallets()
        let balance = await client.payment_provider.getBalance()

        let inventory = await client.api_provider.getInventory(client.steamID.getSteamID64(), App.TF2)
        let keys = client.api_provider.getItemFromInventory(inventory, TF2Item.Key)

        let key_sell_price = KeyPrice.getSellPrice()
        let key_buy_price = KeyPrice.getBuyPrice()

        let formatted = wallets.map(wallet => {
            let currency = wallet.currency.toUpperCase()
            let can_buy = Math.floor(wallet.usd_balance / key_buy_price)

            return `${currency} - ${wallet.balance} (${(wallet.usd_balance).toFixed(2)}$). We can buy ${can_buy} keys for ${currency}`
        })


        let msg = `
        Total balance: ${balance}$
        Actual keys stock: ${keys.length}
        We are buying for ${key_buy_price.toFixed(2)}$
        We are selling for ${key_sell_price.toFixed(2)}$
        
        Available currencies:
        ${formatted.join('\n')}
        `

        await client.chat.sendFriendMessage(steamid, msg)
    }

}