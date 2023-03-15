export interface PaymentProcessor {
    createInvoice(amount: number) : Promise<string>
    withdraw(amount: number, wallet: string) : Promise<string>
    getBalance() : Promise<number>
    validateAddress(address: string) : Promise<boolean>
}