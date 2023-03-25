import { TradeOffer } from "./TradeOffer";

export interface Wallet {
    id: string
    currency: string
    balance: number
    rate: number

    usd_balance: number
}

export interface Invoice {
    price: number
    status: string
    id: string
    metadata: {
        steamid: string
        amount: number
        success: boolean
    }
}

export interface Payout {
    id: string
    status: string
    amount: string
    tx_hash: string
    metadata: {
        trade_id: string
        steamid: string
    }
}

export interface PaymentProcessor {
    createInvoice(amount: number, steamid: string, item_amount: number) : Promise<Invoice>
    getPaidInvoices() : Promise<Invoice[]>
    getPayouts() : Promise<Payout[]>
    completeInvoice(invoice: Invoice) : Promise<boolean>
    createPayout(amount_usd: number, wallet: Wallet, destination: string, offer: TradeOffer) : Promise<Payout>
    getBalance() : Promise<number>
    getWallets() : Promise<Wallet[]>
    validateAddress(address: string, currency: string) : boolean
}