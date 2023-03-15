import {WrongFormatException} from "../exceptions/Command";

export class Command {
    private command: string
    private args: string[]

    constructor(command: string, args: string[]) {
        this.command = command
        this.args = args.filter(arg => arg.length > 0)
    }


    public static parseCommand(cmd: string) : Command {
        let regexp = new RegExp(/(?<prefix>(?:^|^[\s\n\t\r]+)\/(?:[\s\n\t\r]*)|(?<=[\s\n\t\r])\.:(?:[\s\n\t\r]*)|(?<=[\s\n\t\r])::(?:[\s\n\t\r]*))(?<command>[a-zA-Z0-9]+)(?:[\s\n\t\r]*)(?<arguments>[^]*?(?=(?<=[\s\n\t\r])\.:|(?<=[\s\n\t\r])::|$))/g)

        let result = regexp.exec(cmd)

        if (result == null)
            throw new WrongFormatException()

        let groups = result.groups

        return new Command(groups.command, groups.arguments.split(' '))
    }

    get Command() {
        return this.command
    }

    get Args() {
        return this.args
    }
}