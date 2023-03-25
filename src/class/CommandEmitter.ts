import {TypedEmitter} from "tiny-typed-emitter";
import {CommandProcessor} from "../interface/CommandProcessor";
import {Command} from "./Command";
import { UnknownCommandException, UnknownCommandProcessorException } from "../exceptions/Command";
import {Steam} from "./steam/Steam";
import { Logger } from "@nestjs/common";
import { Argument } from "./Argument";


export class CommandEmitter extends TypedEmitter {
    public commands: CommandProcessor[]
    public static instance: CommandEmitter
    constructor() {
        super();

        this.commands = []
    }

    public static getInstance() : CommandEmitter {
        if (!this.instance)
            this.instance = new CommandEmitter()

        return this.instance
    }

    private findCommandProcessor(cmd: Command) : CommandProcessor | null {
        for (let processor of this.commands)
            if (processor.name == cmd.Command)
                return processor

        return null
    }

    public registerCommand(processor: CommandProcessor) {
        this.commands.push(processor)
        this.on(processor.name, processor.process)
    }

    public runCommand(cmd: Command, client: Steam, steamid: string) {
        let listeners = this.listeners(cmd.Command)
        if (listeners.length == 0)
            throw new UnknownCommandException()

        let processor = this.findCommandProcessor(cmd)
        if (processor == null)
            throw new UnknownCommandProcessorException()

        Argument.checkArguments(processor.arguments, cmd.Args)

        Logger.debug(`${cmd.Command} command with ${steamid} and ${JSON.stringify(cmd.Args)}`)
        this.emit(cmd.Command, cmd, client, steamid)
    }
}