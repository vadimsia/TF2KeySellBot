import { Module } from '@nestjs/common';
import {BotModule} from "../bot/bot.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import {join} from 'path'

@Module({
  imports: [
      BotModule,
      ScheduleModule.forRoot(),
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, '../..', 'static')
      })
  ]
})
export class AppModule {}
