import { Module } from '@nestjs/common';
import {BotController} from "./bot.contoller";
import {BotService} from "./bot.service";

@Module({
    controllers: [BotController],
    providers: [BotService]
})
export class BotModule {}
