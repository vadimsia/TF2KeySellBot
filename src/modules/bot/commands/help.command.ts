import {Logger} from "@nestjs/common";

import {Command} from "../../../class/Command";
import {Steam} from "../../../class/Steam";
import {CommandProcessor} from "../../../interface/CommandProcessor";
import {CommandEmitter} from "../../../class/CommandEmitter";
import {Argument} from "../../../class/Argument";

export class HelpCommand implements CommandProcessor {
    public name = 'help'
    public arguments: Argument[] = []
    public description = 'show command list'
    public example = '/help'

    public async process(cmd: Command, client: Steam, steamid: string) {
        let emitter = CommandEmitter.getInstance()
        let descriptions = emitter.commands.map(command => {
            let args = command.arguments.map(arg => { return `<${arg.name}>` }).join(' ')
            return `
            /${command.name} ${args} - ${command.description}
            Example: ${command.example}`
        })

        let msg = `
        Available commands:
        ${descriptions.join('\n')}
        `

        await client.chat.sendFriendMessage(steamid, msg)
    }

}