import { TradeOffer } from "../../../interface/TradeOffer";
import { Steam } from "../../../class/steam/Steam";
import { Logger } from "@nestjs/common";
import { ETradeOfferState } from "steam-user";
import { differenceInMinutes } from "date-fns";

export class ActiveOfferProcess {
    public static async run(offer: TradeOffer, client: Steam) {
        Logger.debug(`Got offer #${offer.id} with state ${offer.state} - ${ETradeOfferState[offer.state]}`)
        let difference = differenceInMinutes(
            new Date(),
            offer.created
        )

        if (difference >= 10) {
            Logger.debug(`Cancelling offer`)
            await client.cancelOffer(offer)
            await client.chat.sendFriendMessage(offer.partner, `Cancelling offer`)
            return
        }

        Logger.debug(`Difference in minutes: ${difference}`)
        await client.chat.sendFriendMessage(offer.partner, `Offer will be cancelled in ${10 - difference} minutes!`)
    }
}