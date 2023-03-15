import { App } from "../enum/App";
import { Item } from "../class/Item";
import { SteamInventory } from "./SteamInventory";

export interface SteamAPIProvider {
    key: string

    getInventory(steamid: string, app: App) : Promise<SteamInventory>
    getItemFromInventory(inventory: SteamInventory, classid: string) : Item[]
}