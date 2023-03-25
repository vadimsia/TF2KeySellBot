import { Invoice, PaymentProcessor, Payout, Wallet } from "../../interface/PaymentProcessor";
import axios, {AxiosInstance} from 'axios'
import { TradeOffer } from "../../interface/TradeOffer";
import { Constants } from "../Constants";
import { SendPayoutException } from "../../exceptions/Payment";
import * as Validator from "@swyftx/api-crypto-address-validator"


export interface BitCartInvoiceOptions {
    redirect_url?: string
}

export class BitCart implements PaymentProcessor {
    private client: AxiosInstance
    private store_id: string

    constructor(host: string, api_key: string, store_id: string) {
        this.store_id = store_id

        this.client = axios.create({
            baseURL: `${host}/api`,
            timeout: 5000,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            }
        })
    }

    async createInvoice(amount: number, steamid: string, item_amount: number, options?: BitCartInvoiceOptions): Promise<Invoice> {
        const invoiceCreation = {
            "price": amount,
            "store_id": this.store_id,
            "redirect_url": options?.redirect_url || '',
            "metadata": {
                "steamid": steamid,
                "amount": item_amount,
                "success": false
            }
        };

        let response = await this.client.post('/invoices', invoiceCreation)
        return response.data
    }

    async getPaidInvoices() : Promise<Invoice[]> {
        let params = {
            limit: 10,
            query: 'paid|confirmed|complete'
        }

        let invoices: Invoice[] = (await this.client.get('/invoices', {params})).data.result

        return invoices.filter(invoice => invoice.metadata.success == false)
    }

    async completeInvoice(invoice: Invoice) : Promise<boolean> {
        invoice.metadata.success = true

        let data = {
            metadata: invoice.metadata
        }

        let response: Invoice = (await this.client.patch(`/invoices/${invoice.id}`, data)).data
        return response.metadata.success == true
    }

    async getWallets(): Promise<Wallet[]> {
        let wallets: Wallet[] = (await this.client.get('/wallets')).data.result

        for (let wallet of wallets) {
            const params = {
                currency: wallet.currency
            }

            let result = await this.client.get('/cryptos/rate', {params})
            wallet.rate = result.data as number
            wallet.usd_balance = wallet.balance * wallet.rate
        }

        return wallets
    }

    validateAddress(address: string, currency: string): boolean {
        return Validator.validate(address, currency);
    }

    async createPayout(amount_usd: number, wallet: Wallet, destination: string, offer: TradeOffer): Promise<Payout> {
        let data = {
            metadata: {
                trade_id: offer.id,
                steamid: offer.partner.getSteamID64()
            },
            currency: 'USD',
            store_id: Constants.BITCART.STORE_ID,
            wallet_id: wallet.id,
            destination: destination,
            amount: amount_usd
        }

        let payout: Payout = (await this.client.post('/payouts', data)).data

        let batch_data = {
            command: 'send',
            ids: [payout.id],
            options: {
                wallets: {},
                batch: false
            }
        }

        let response = await this.client.post('/payouts/batch', batch_data)
        if (response.data != true)
            throw new SendPayoutException()


        return payout
    }

    async getBalance(): Promise<number> {
        let response = await this.client.get('/wallets/balance')
        return response.data
    }

    async getPayouts(): Promise<Payout[]> {
        let response = await this.client.get('/payouts')

        return response.data.result
    }

}