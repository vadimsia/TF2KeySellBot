FROM node:lts-alpine as build

WORKDIR /app
COPY package.json .
RUN npm i
RUN npm i -g @nestjs/cli

FROM build as app

WORKDIR /app
COPY . .

CMD nest start