import { Command } from "../Command";
import { Argument, ArgumentType } from "../Argument";


describe('Command', () => {
    it ("regular command test", () => {
        let command = Command.parseCommand("/hello world 213 421")

        expect(command.Command).toBe("hello")
        console.log(command.Args)
    })

    it("fast test", () => {
        function enumerable() {
            return function (target: Test, propertyKey: string, descriptor: PropertyDescriptor) {
                console.log(target)
                console.log(propertyKey)
                console.log(descriptor.value)
                console.log(target.prop)
            };
        }

        class Test {
            prop: number
            @enumerable()
            meth(prop, prop2) {
                return 1
            }
        }

        new Test().meth(1,2)

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