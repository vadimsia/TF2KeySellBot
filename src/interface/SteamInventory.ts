export interface SteamInventory {
    success: number
    assets: {
        classid: string
        assetid: string
    }[]
}