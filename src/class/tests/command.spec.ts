import { Command } from "../Command";
import { Argument, ArgumentType } from "../Argument";


describe('Command', () => {
    it ("regular command test", () => {
        let command = Command.parseCommand("/hello world 213 421")

        expect(command.Command).toBe("hello")
        console.log(command.Args)
    })

    it("fast test", () => {
        let msg = `
        Available commands:
        asdasdas
        `


    })


    it ("arguments check test", () => {
        let args: Argument[] = [
            new Argument('test', ArgumentType.NUMBER),
            new Argument('test2', ArgumentType.STRING)
        ]

        let values = ['1', 'asd1']
        Argument.checkArguments(args, values)

        args = []
        values = []
        Argument.checkArguments(args, values)
    })
})