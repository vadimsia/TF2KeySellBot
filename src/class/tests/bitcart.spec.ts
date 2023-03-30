import { BitCart } from "../payproc/BitCart";

describe('BitCart', () => {
    let bitcart = new BitCart('https://bitcart.tfkey.net', 'wfSVxlLX7UemSkJQ5soYFwX5KL-BIdjamFMs31yAZWk', 'FKcFYmmbqPvqfUzSDpHozVEDCQwLFRWG')

    it ('invoice test', async () => {
        let invoice = await bitcart.createInvoice(10, "123", 1)
        console.log(invoice)
    })

    it ('get invoices test', async () => {
        let invoices = await bitcart.getPaidInvoices()
        console.log(invoices)
    })

    it('get payouts test', async () => {
        let payouts = await bitcart.getPayouts()
        console.log(payouts)
    })

    it('balance test', async () => {
        console.log(await bitcart.getBalance())
    })

    it('wallets test', async () => {
        let wallets = await bitcart.getWallets()
        let balance = wallets.map(wallet => wallet.usd_balance).reduce((a, b) => a + b, 0)
        console.log(balance)
    })

    it('validate address', async () => {
        console.log(bitcart.validateAddress('TL6QqKZGoS1LkEAhL2mgYHmFBZKY7dubRA', 'TRX'))
    })
})