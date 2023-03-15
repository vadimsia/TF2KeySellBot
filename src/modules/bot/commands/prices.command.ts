import {Command} from "../../../class/Command";
import {Steam} from "../../../class/Steam";
import {CommandProcessor} from "../../../interface/CommandProcessor";
import {Logger} from "@nestjs/common";
import {Argument} from "../../../class/Argument";

export class PricesCommand implements CommandProcessor {
    public name = 'prices'
    public arguments: Argument[] = []
    public description = 'show prices for key'
    public example = '/prices'

    public async process(cmd: Command, client: Steam, steamid: string) {
        await client.chat.sendFriendMessage(steamid, "Hello from prices!!")
    }


}