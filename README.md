# TFKEYSellBot

Example `docker-compose.yml`

```yml
version: "3.7"
services:
  steamdb:
    image: threadshakur/tfkeysellbot
    container_name: tfkeysellbot-container
    environment:
      - STEAM_APIS_KEY=
      - BITCART_CART_HOST=https://bitcart.tfkey.net
      - BITCART_PAYMENT_HOST=https://tfkey.net
      - BITCART_API_KEY=
      - BITCART_STORE_ID=FKcFYmmbqPvqfUzSDpHozVEDCQwLFRWG
      - STEAM_LOGIN=
      - STEAM_PASSWORD=
      - STEAM_SHARED_SECRET=
      - STEAM_IDENTITY_SECRET=
      - ADMINS=76561198193808842
    ports:
      - "3000:3000"
      - 
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 300 tfkeysellbot-container
```

* To run service use following steps:
    - Copy example `docker-compose.yml` everywhere
    - Fill required env variables
    - `docker-compose up` to run
    - `docker-compose up -d` to run as daemon
    - `docker-compose pull` to pull latest service build manually
    - access api by :3000 post (can be changed in docker-compose file)
    - service with this config will restart automaticly after server restarts and etc, so you need just run it**