import { Command } from "../../../class/Command";
import { Steam } from "../../../class/steam/Steam";
import { CommandProcessor } from "../../../interface/CommandProcessor";
import { Argument, ArgumentType } from "../../../class/Argument";
import { KeyPrice } from "../../../class/steam/KeyPrice";

export class SellCommand implements CommandProcessor {
    public name = 'sell'
    public arguments: Argument[] = [
        new Argument('amount', ArgumentType.NUMBER),
        new Argument('currency', ArgumentType.STRING),
        new Argument('wallet', ArgumentType.STRING)
    ]
    public description = 'sell keys to bot'
    public example = '/sell 50 ETH 0xae838eea358aeafa265b72f62bd11aa1296bae95db5d24d74f2cce9ff158bf86'

    public async process(cmd: Command, client: Steam, steamid: string) {
        if (await client.checkBusy(steamid))
            return

        await client.quoteMessage(steamid, `Offer is being processed, hold on..`)

        let amount = parseInt(cmd.Args[0])
        let currency = cmd.Args[1].toUpperCase()
        let wallet = cmd.Args[2]

        let message = `${currency}:${wallet}`

        let wallets = await client.payment_provider.getWallets()
        let wall = wallets.find(wall => wall.name.toUpperCase() == currency)

        if (!wall) {
            await client.quoteMessage(steamid, `${currency} is currently not supported, please use /stocks to see the supported cryptocurrencies`)
            return
        }

        if (!client.payment_provider.validateAddress(wallet, wall.currency)) {
            await client.quoteMessage(steamid, `Input address is invalid`)
            return
        }

        if (wall.usd_balance < KeyPrice.calcBuyPrice(amount)) {
            await client.quoteMessage(steamid, `We have no enough balance on this wallet to buy ${amount} keys, use /stocks`)
            return
        }

        try {
            await client.makeBusy()
            await client.retreiveKeys(steamid, amount, message)
        } catch (e) {
            await client.quoteMessage(steamid, `${e} while running sell command`)
        }

    }


}