import { TradeOffer } from "./TradeOffer";

export interface Wallet {
    id: string
    currency: string
    name: string
    hint: string
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
        last_status: string
    }
}

export interface PaymentProcessor {
    createInvoice(amount: number, steamid: string, item_amount: number) : Promise<Invoice>
    getPaidInvoices() : Promise<Invoice[]>
    getPendingInvoices() : Promise<Invoice[]>
    getPayouts() : Promise<Payout[]>
    completeInvoice(invoice: Invoice) : Promise<boolean>
    updatePayoutStatus(payout: Payout) : Promise<void>
    createPayout(amount_usd: number, wallet: Wallet, destination: string, offer: TradeOffer) : Promise<Payout>
    getBalance() : Promise<number>
    getFee(wallet: Wallet) : number
    getWallets() : Promise<Wallet[]>
    validateAddress(address: string, currency: string) : boolean
}