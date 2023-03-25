import { Command } from "../../../class/Command";
import { Steam } from "../../../class/steam/Steam";
import { CommandProcessor } from "../../../interface/CommandProcessor";
import { Argument, ArgumentType } from "../../../class/Argument";
import { NoEnoughItemsException } from "../../../exceptions/Steam";
import { KeyPrice } from "../../../class/steam/KeyPrice";
import { Constants } from "../../../class/Constants";

export class BuyCommand implements CommandProcessor {
    public name = 'buy'
    public arguments: Argument[] = [
        new Argument('amount', ArgumentType.NUMBER)
    ]
    public description = 'buy keys from bot'
    public example = '/buy 50'

    public async process(cmd: Command, client: Steam, steamid: string) {
        await client.chat.sendFriendMessage(steamid, `Creating invoice, wait a bit...`)

        let amount = parseInt(cmd.Args[0])

        try {
            let keys = await client.getKeys(client.steamID.getSteamID64())

            if (keys.length < amount)
                throw new NoEnoughItemsException()

            let price = KeyPrice.calcSellPrice(amount)
            let invoice = await client.payment_provider.createInvoice(price, steamid, amount)
            await client.chat.sendFriendMessage(steamid, `Here is your invoice: ${Constants.BITCART.PAYMENT_HOST}?invoice=${invoice.id}`)
        } catch (e) {
            await client.chat.sendFriendMessage(steamid, `${e} while running buy command`)
        }

    }


}