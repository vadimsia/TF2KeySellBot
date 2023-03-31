import { TradeOffer } from "../../../interface/TradeOffer";
import { Steam } from "../../../class/steam/Steam";
import { Logger } from "@nestjs/common";
import { ETradeOfferState } from "steam-user";
import { differenceInMinutes } from "date-fns";
import { Constants } from "../../../class/Constants";

export class ActiveOfferProcess {
    public static async run(offer: TradeOffer, client: Steam) {
        Logger.debug(`Got offer #${offer.id} with state ${offer.state} - ${ETradeOfferState[offer.state]}`)
        let difference = differenceInMinutes(
            new Date(),
            offer.created
        )

        if (difference >= Constants.TRADE_CANCEL_TIME) {
            Logger.debug(`Cancelling offer`)
            await client.cancelOffer(offer)
            await client.quoteMessage(offer.partner.getSteamID64(), `Cancelling offer`)
            return
        }

        Logger.debug(`Difference in minutes: ${difference}`)
        await client.quoteMessage(offer.partner.getSteamID64(), `Offer will be cancelled in ${Constants.TRADE_CANCEL_TIME - difference} minutes!`)
    }
}