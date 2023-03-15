import { Controller, Get } from '@nestjs/common';

@Controller('bot')
export class BotController {
    @Get('/')
    index(): string {
        return 'Hello from TFKeySell Bot!!!';
    }
}