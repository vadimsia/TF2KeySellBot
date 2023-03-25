import {Steam} from "../steam/Steam";
import {SteamApis} from "../steam/SteamApis";
import {App} from "../../enum/App";


describe('Steam', () => {
    it ("inventory test", async () => {
        let api = new SteamApis('ap3KuvXvhDEAepbgXvxvRik60cY')
        let inventory = await api.getInventory('76561198892652425', App.TF2)
        console.log(inventory)
        api.getItemFromInventory(inventory, '101785959')

    }, 1000 * 30)
})