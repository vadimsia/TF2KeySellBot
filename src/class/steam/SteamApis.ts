import { App } from "../../enum/App";
import * as request from "request-promise";
import { SteamInventoryException } from "../../exceptions/Steam";
import { Item } from "../Item";
import { SteamAPIProvider } from "../../interface/SteamAPIProvider";
import { SteamInventory } from "../../interface/SteamInventory";


export class SteamApis implements SteamAPIProvider {

    key: string

    constructor(key: string) {
        this.key = key
    }

    async getInventory(steamid: string, app: App): Promise<SteamInventory> {
        let qs = {
            api_key: this.key
        }

        let data: SteamInventory = await request.get(`https://api.steamapis.com/steam/inventory/${steamid}/${app}/2`, {qs, json: true})
        if (data.success != 1)
            throw new SteamInventoryException()

        return data
    }

    getItemFromInventory(inventory: SteamInventory, classid: string) : Item[] {
        if (inventory.total_inventory_count == 0)
            return []

        return inventory.assets.map(asset => {
            if (asset.classid == classid)
                return new Item(asset.assetid, App.TF2)
        }).filter(asset => asset != undefined)
    }
}