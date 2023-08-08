import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import openapi from './common/configs/openai.config';
import { OpenaiModule } from './modules/openai/openai.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs/`);

@Module({
  imports: [
    OpenaiModule,
    WhatsappModule,
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [openapi],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
