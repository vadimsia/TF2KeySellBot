import {Steam} from "../Steam";
import {SteamApis} from "../SteamApis";
import {App} from "../../enum/App";


describe('Steam', () => {
    it ("inventory test", async () => {
        let api = new SteamApis('ap3KuvXvhDEAepbgXvxvRik60cY')
        let inventory = await api.getInventory('76561198151817654', App.TF2)
        await api.getItemFromInventory(inventory, '101785959')

    }, 1000 * 30)
})