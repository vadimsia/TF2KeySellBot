
export class Constants {
    public static STEAM_APIS = {
        API_KEY: process.env.STEAM_APIS_KEY || 'ap3KuvXvhDEAepbgXvxvRik60cY'
    }

    public static BITCART = {
        CART_HOST: process.env.BITCART_CART_HOST || 'https://bitcart.tfkey.net',
        PAYMENT_HOST: process.env.BITCART_PAYMENT_HOST || 'http://localhost:3000',
        API_KEY: process.env.BITCART_API_KEY || 'wfSVxlLX7UemSkJQ5soYFwX5KL-BIdjamFMs31yAZWk',
        STORE_ID: process.env.BITCART_STORE_ID || 'FKcFYmmbqPvqfUzSDpHozVEDCQwLFRWG'
    }

    public static STEAM = {
        LOGIN: process.env.STEAM_LOGIN || 'oragok15004',
        PASSWORD: process.env.STEAM_PASSWORD || '6YGwBTWDRe5JsRT6',
        SHARED_SECRET: process.env.STEAM_SHARED_SECRET || '7EwOed6tG/xtZQLz5DE+qMmnPlo=',
        IDENTITY_SECRET: process.env.STEAM_IDENTITY_SECRET || 'k0N4WNsYs+RYsIfSeJTDZ8FYjGI='
    }

    public static ADMINS = process.env.ADMINS || '76561198193808842'
}