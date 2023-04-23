import { App } from "../../enum/App";
import { SteamInventoryException } from "../../exceptions/Steam";
import { Item } from "../Item";
import { SteamAPIProvider } from "../../interface/SteamAPIProvider";
import { SteamInventory } from "../../interface/SteamInventory";
import axios from "axios";


export class SteamApis implements SteamAPIProvider {

    key: string

    constructor(key: string) {
        this.key = key
    }

    async getInventory(steamid: string, app: App): Promise<SteamInventory> {
        let params = {
            api_key: this.key
        }

        let response
        try {
            response = await axios.get(`https://api.steamapis.com/steam/inventory/${steamid}/${app}/2`, { params })
        } catch (e) {
            throw new Error('Error while loading inventory, make sure its public and try again')
        }

        if (response.data.success != 1)
            throw new SteamInventoryException()

        return response.data
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