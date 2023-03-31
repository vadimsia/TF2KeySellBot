import { TradeOffer } from "../../../interface/TradeOffer";
import { Steam } from "../../../class/steam/Steam";
import { Logger } from "@nestjs/common";
import { ETradeOfferState } from "steam-user";
import { TF2Item } from "../../../enum/TF2Item";
import { KeyPrice } from "../../../class/steam/KeyPrice";

export class AcceptedOfferProcess {
    public static async run(offer: TradeOffer, client: Steam) {
        Logger.debug(`Got offer #${offer.id} with state ${offer.state} - ${ETradeOfferState[offer.state]}`)
        let keys_to_receive = offer.itemsToReceive.filter(item => item.classid == TF2Item.Key)
        let keys_to_give = offer.itemsToGive.filter(item => item.classid == TF2Item.Key)

        Logger.debug(`Credentials: ${offer.message}`)
        Logger.debug(`Keys - receive: ${keys_to_receive.length} / give: ${keys_to_give.length}`)

        if (keys_to_receive.length < keys_to_give.length)
            return

        let payouts = await client.payment_provider.getPayouts()
        let payout = payouts.find(payout => payout.metadata.trade_id == offer.id)

        if (payout) {
            if (payout.status == payout.metadata.last_status)
                return

            Logger.debug(`${offer.id} Already payed out`)

            await client.quoteMessage(offer.partner.getSteamID64(), `Payout for offer ${offer.id} with amount ${payout.amount}$ has ${payout.status} status`)
            await client.quoteMessage(offer.partner.getSteamID64(), `TX ID: ${payout.tx_hash}`)
            await client.payment_provider.updatePayoutStatus(payout)
            return
        }

        let [currency, destination] = offer.message.split(':')
        let wallets = await client.payment_provider.getWallets()
        let wallet = wallets.find(wallet => wallet.name.toUpperCase() == currency.toUpperCase())
        let price = KeyPrice.calcBuyPrice(keys_to_receive.length) - client.payment_provider.getFee(wallet)

        if (!wallet) {
            Logger.error(`Invalid currency ${currency}`)
            await client.quoteMessage(offer.partner.getSteamID64(), `Currency ${currency} is invalid`)
            return
        }


        Logger.debug(`Sending ${price} to this gentleman`)
        payout = await client.payment_provider.createPayout(price, wallet, destination, offer)
        await client.quoteMessage(offer.partner.getSteamID64(), `Payout for offer ${offer.id} with amount ${payout.amount}$ has ${payout.status} status`)
    }
}