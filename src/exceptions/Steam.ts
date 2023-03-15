export class SteamInventoryException extends Error{
    constructor() {
        super();
        this.name = 'SteamInventoryException'
    }
}

export class NoEnoughItemsException extends Error{
    constructor() {
        super();
        this.name = 'NoEnoughItemsException'
    }
}

