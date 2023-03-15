import { PaymentProcessor } from "../interface/PaymentProcessor";
import { Currency } from "../enum/Currency";

import * as coinremitter from "coinremitter-api";


interface BalanceResult {
    data: {
        balance: number,
        wallet_name: string,
        coin_name: string
    }
}
interface ValidateResult {
    data:{
        "valid": boolean
    }
}
interface InvoiceResult {
    msg: string
    data: {
        id: string
        url: string
    }
}
interface WithdrawResult {
    msg: string
    data: {
        id: string
        explorer_url: string
    }
}
interface ErrorResult {
    data: any
    flag: number
    msg: string
}

interface RemitterInstance {
    getBalance(callback: (err: ErrorResult, res: BalanceResult) => void) : void
    validateAddress(params: object, callback: (err: ErrorResult, res: ValidateResult) => void) : void
    createInvoice(params: object, callback: (err: ErrorResult, res: InvoiceResult) => void) : void
    withdraw(params: object, callback: (err: ErrorResult, res: WithdrawResult) => void) : void
}

export class CoinRemitter implements PaymentProcessor {
    readonly api_key: string
    readonly password: string
    readonly currency: Currency

    private instance: RemitterInstance

    constructor(api_key: string, password: string, currency: Currency) {
        this.api_key = api_key
        this.password = password
        this.currency = currency

        this.instance = new coinremitter(this.api_key, this.password, currency)
    }
    createInvoice(amount: number): Promise<string> {
        let params = {
            amount: amount,
            currency: 'USD'
        }

        return new Promise<string>((resolve, reject) => {
            this.instance.createInvoice(params, (err, res) => {
                if (err)
                    return reject(err.msg)

                resolve(res.data.url)
            })
        })
    }

    withdraw(amount: number, wallet: string): Promise<string> {
        let params = {
            to_address: wallet,
            amount: amount
        }

        return new Promise<string>((resolve, reject) => {
            this.instance.withdraw(params, (err, res) => {
                if (err)
                    return reject(err.msg)

                resolve(res.data.explorer_url)
            })
        })
    }

    getBalance(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.instance.getBalance((err, res) => {
                if (err)
                    return reject(err.msg)

                resolve(res.data.balance)
            })
        })
    }

    validateAddress(address: string): Promise<boolean> {
        let params = {
            address
        }

        return new Promise<boolean>((resolve, reject) => {
            this.instance.validateAddress(params, (err, res) => {
                if (err)
                    return resolve(false)

                resolve(res.data.valid)
            })
        })
    }

}