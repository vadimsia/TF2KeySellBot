import { InvalidArgumentAmount, InvalidArgumentType } from "../exceptions/Command";

export enum ArgumentType {
    NUMBER = 'number',
    STRING = 'string'
}

export class Argument {
    name: string
    type: ArgumentType

    constructor(name: string, type: ArgumentType) {
        this.name = name
        this.type = type
    }

    private static isNumeric(value) {
        return /^\d+$/.test(value);
    }

    public static checkArguments(args: Argument[], values: string[]) {
        if (args.length != values.length)
            throw new InvalidArgumentAmount()

        for (let i = 0; i < args.length; i++) {
            let arg = args[i]

            if (arg.type == ArgumentType.NUMBER && !this.isNumeric(values[i]))
                throw new InvalidArgumentType()

            if (arg.type == ArgumentType.STRING && this.isNumeric(values[i]))
                throw new InvalidArgumentType()
        }
    }
}
