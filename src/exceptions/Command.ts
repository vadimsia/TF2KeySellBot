export class WrongFormatException extends Error{
    constructor() {
        super();
        this.name = 'WrongFormatException'
    }
}
export class UnknownCommandException extends Error {
    constructor() {
        super();
        this.name = 'UnknownCommandException'
    }
}

export class UnknownCommandProcessorException extends Error {
    constructor() {
        super();
        this.name = 'UnknownCommandProcessorException'
    }
}

export class InvalidArgumentAmount extends Error {
    constructor() {
        super();
        this.name = 'InvalidArgumentAmount'
    }
}

export class InvalidArgumentType extends Error {
    constructor() {
        super();
        this.name = 'InvalidArgumentType'
    }
}