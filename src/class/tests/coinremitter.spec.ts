import { CoinRemitter } from "../CoinRemitter";
import { Currency } from "../../enum/Currency";

describe('Remitter', () => {
    it ('balance test', async () => {
        let remitter = new CoinRemitter('$2y$10$V2NT/DxfFBBsijSwGxY5JebD/uSoIma7wJsPR535u6Zmj.giaQtvS', 'qwerty12345AV', Currency.LTC)

        console.log(await remitter.getBalance())
    }, 1000 * 30)

    it ('validate test', async () => {
        let remitter = new CoinRemitter('$2y$10$V2NT/DxfFBBsijSwGxY5JebD/uSoIma7wJsPR535u6Zmj.giaQtvS', 'qwerty12345AV', Currency.LTC)

        console.log(await remitter.validateAddress('nc2amNbZqGqvquktWVYGMjpjoEHMJJUNiX'))
    }, 1000 * 30)

    it ('create invoice', async () => {
        let remitter = new CoinRemitter('$2y$10$V2NT/DxfFBBsijSwGxY5JebD/uSoIma7wJsPR535u6Zmj.giaQtvS', 'qwerty12345AV', Currency.LTC)

        console.log(await remitter.createInvoice(20))
    }, 1000 * 30)

    it ('withdraw', async () => {
        let remitter = new CoinRemitter('$2y$10$V2NT/DxfFBBsijSwGxY5JebD/uSoIma7wJsPR535u6Zmj.giaQtvS', 'qwerty12345AV', Currency.LTC)

        console.log(await remitter.withdraw(0.01, 'La9RYXrfDNF4SsYxMenuPKQgC6r9sqCNk5'))
    }, 1000 * 30)
})