import {Command} from "../../../class/Command";
import {Steam} from "../../../class/Steam";
import {CommandProcessor} from "../../../interface/CommandProcessor";
import {Logger} from "@nestjs/common";
import {Argument} from "../../../class/Argument";

export class CurrencyCommand implements CommandProcessor {
    public name = 'currency'
    public arguments: Argument[] = []
    public description = 'show available currencies'
    public example = '/currency'


    async process(cmd: Command, client: Steam, steamid: string) {
        let currencies = [
            'BTC',
            'ETH',
            'XRP'
        ]

        let msg = `
        Available currencies:
        ${currencies.join('\n')}
        `

        await client.chat.sendFriendMessage(steamid, msg)
    }

}