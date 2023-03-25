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
            Logger.debug(`${offer.id} Already payed out`)
            await client.chat.sendFriendMessage(offer.partner, `Payout for offer ${offer.id} with amount ${payout.amount}$ has ${payout.status} status`)
            await client.chat.sendFriendMessage(offer.partner, `TX ID: ${payout.tx_hash}`)
            return
        }

        let [currency, destination] = offer.message.split(':')
        let price = KeyPrice.calcBuyPrice(keys_to_receive.length)
        let wallets = await client.payment_provider.getWallets()
        let wallet = wallets.find(wallet => wallet.currency.toUpperCase() == currency)

        if (!wallet) {
            Logger.error(`Invalid currency ${currency}`)
            await client.chat.sendFriendMessage(offer.partner, `Currency ${currency} is invalid`)
            return
        }


        Logger.debug(`Sending ${price} to this gentleman`)
        payout = await client.payment_provider.createPayout(price, wallet, destination, offer)
        await client.chat.sendFriendMessage(offer.partner, `Payout for offer ${offer.id} with amount ${payout.amount}$ has ${payout.status} status`)
    }
}