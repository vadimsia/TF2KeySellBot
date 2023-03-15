import {Command} from "../class/Command";
import {Steam} from "../class/Steam";
import {Argument} from "../class/Argument";

export interface CommandProcessor {
    name: string
    arguments: Argument[]
    description: string
    example: string
    process(cmd: Command, client: Steam, steamid: string)
}