
export class KeyPrice {
    private static instance: KeyPrice

    private sell_price: number
    private buy_price: number
    private static getInstance() : KeyPrice {
        if (!this.instance)
            this.instance = new KeyPrice()

        return this.instance
    }

    private static prettify(num: number) : number {
        return parseFloat(num.toFixed(2))
    }

    public static updateSellPrice(price: number) : void {
        this.getInstance().sell_price = price
    }

    public static getSellPrice() : number {
        return this.getInstance().sell_price
    }

    public static getBuyPrice() : number {
        return this.getInstance().buy_price
    }

    public static calcSellPrice(amount: number) : number {
        let sell_price = amount * this.getSellPrice()
        return this.prettify(sell_price)
    }

    public static calcBuyPrice(amount: number) : number {
        let buy_price = amount * this.getBuyPrice()
        return this.prettify(buy_price)
    }

    constructor() {
        this.sell_price = parseInt(process.env.SELL_PRICE) || 1.90
        this.buy_price = parseInt(process.env.BUY_PRICE) || 1.75
    }

}