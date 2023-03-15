import {BotService} from "../bot.service";
import sleep from "../../../global";

describe('Bot', () => {
    let botService: BotService;

    beforeAll(() => {
        botService = new BotService()
    });

    it('some test', async () => {
        await sleep(5_000)
        console.log('working')
        await botService.checkOffers()

    }, 1000 * 90);
});