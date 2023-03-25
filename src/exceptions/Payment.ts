export class SendPayoutException extends Error{
    constructor() {
        super();
        this.name = 'SendPayoutException'
    }
}