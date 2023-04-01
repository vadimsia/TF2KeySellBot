import {Command} from "../../../class/Command";
import {Steam} from "../../../class/steam/Steam";
import {CommandProcessor} from "../../../interface/CommandProcessor";
import {Argument} from "../../../class/Argument";
import { KeyPrice } from "../../../class/steam/KeyPrice";
import { App } from "../../../enum/App";
import { TF2Item } from "../../../enum/TF2Item";

export class StocksCommand implements CommandProcessor {
    public name = 'stocks'
    public arguments: Argument[] = []
    public description = 'show stocks'
    public example = '/stocks'


    async process(cmd: Command, client: Steam, steamid: string) {
        await client.quoteMessage(steamid, `Collecting information, wait a bit...`)

        let wallets = await client.payment_provider.getWallets()
        let balance = wallets.map(wallet => wallet.usd_balance).reduce((a, b) => a + b, 0)

        let inventory = await client.api_provider.getInventory(client.steamID.getSteamID64(), App.TF2)
        let keys = client.api_provider.getItemFromInventory(inventory, TF2Item.Key)

        let key_sell_price = KeyPrice.getSellPrice()
        let key_buy_price = KeyPrice.getBuyPrice()

        let formatted = wallets.map(wallet => {
            let can_buy = Math.floor(wallet.usd_balance / key_buy_price)
            return `${wallet.name} (${wallet.hint}) - ${wallet.balance} (${(wallet.usd_balance).toFixed(2)}💲, bot can afford ${can_buy} 🔑)`
        })


        let msg = ` 
Total balance: ${balance.toFixed(2)}💲
Actual keys stock: ${keys.length}🔑
We are buying for ${key_buy_price.toFixed(2)}💲
We are selling for ${key_sell_price.toFixed(2)}💲

Available currencies:
${formatted.join('\n')}`

        await client.preMessage(steamid, msg)
    }

}