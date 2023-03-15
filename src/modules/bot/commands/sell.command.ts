import { Command } from "../../../class/Command";
import { Steam } from "../../../class/Steam";
import { CommandProcessor } from "../../../interface/CommandProcessor";
import { Argument, ArgumentType } from "../../../class/Argument";

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
        let amount = parseInt(cmd.Args[0])
        let currency = cmd.Args[1]
        let wallet = cmd.Args[2]

        let message = `${currency}:${wallet}`

        try {
            await client.retreiveKeys(steamid, amount, message)
        } catch (e) {
            await client.chat.sendFriendMessage(steamid, `${e} while running sell command`)
        }

    }


}