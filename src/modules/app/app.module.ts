import { Module } from '@nestjs/common';
import {BotModule} from "../bot/bot.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
      BotModule,
      ScheduleModule.forRoot()
  ]
})
export class AppModule {}
