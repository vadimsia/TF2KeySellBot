import { TradeOffer } from "../../../interface/TradeOffer";
import { Steam } from "../../../class/Steam";
import { Logger } from "@nestjs/common";
import { ETradeOfferState } from "steam-user";
import { TF2Item } from "../../../enum/TF2Item";

export class AcceptedOfferProcess {
    public static async run(offer: TradeOffer, client: Steam) {
        Logger.debug(`Got offer #${offer.id} with state ${offer.state} - ${ETradeOfferState[offer.state]}`)
        let keys_to_receive = offer.itemsToReceive.filter(item => item.classid == TF2Item.Key)
        let keys_to_give = offer.itemsToGive.filter(item => item.classid == TF2Item.Key)

        Logger.debug(`Credentials: ${offer.message}`)
        Logger.debug(`Keys - receive: ${keys_to_receive.length} / give: ${keys_to_give.length}`)

        if (keys_to_receive < keys_to_give)
            return

        Logger.debug(`Sending money to this gentleman`)
    }
}