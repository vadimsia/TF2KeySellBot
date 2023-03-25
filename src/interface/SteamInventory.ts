export interface SteamInventory {
    success: number
    total_inventory_count: number
    assets: {
        classid: string
        assetid: string
    }[]
}