import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import openapi from './common/configs/openai.config';
import dbconfig from './common/configs/db.config';
import company from './common/configs/company.config';
import { OpenaiModule } from './modules/openai/openai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { OrdersModule } from './modules/orders/orders.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs/`);

@Module({
  imports: [
    OpenaiModule,
    WhatsappModule,
    ProdutosModule,
    OrdersModule,
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [openapi, dbconfig, company],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbconfig.host'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
