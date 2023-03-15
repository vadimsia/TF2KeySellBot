import { Command } from "../../../class/Command";
import { Steam } from "../../../class/Steam";
import { CommandProcessor } from "../../../interface/CommandProcessor";
import { Argument, ArgumentType } from "../../../class/Argument";
import { NoEnoughItemsException } from "../../../exceptions/Steam";

export class BuyCommand implements CommandProcessor {
    public name = 'buy'
    public arguments: Argument[] = [
        new Argument('amount', ArgumentType.NUMBER)
    ]
    public description = 'buy keys from bot'
    public example = '/buy 50'

    public async process(cmd: Command, client: Steam, steamid: string) {
        let amount = parseInt(cmd.Args[0])

        try {
            let keys = await client.getKeys(client.steamID.getSteamID64())

            if (keys.length < amount)
                throw new NoEnoughItemsException()

            await client.sendKeys(steamid, amount, 'Lol')
        } catch (e) {
            await client.chat.sendFriendMessage(steamid, `${e} while running buy command`)
        }

    }


}