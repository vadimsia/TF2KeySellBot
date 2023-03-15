import { App } from "../enum/App";

export class Item {
    assetid: string
    appid: number
    contextid = 2
    amount = 1

    constructor(assetid: string, app: App) {
        this.assetid = assetid
        this.appid = app
    }

}