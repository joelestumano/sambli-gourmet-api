import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import openapi from './common/configs/openai.config';
import dbconfig from './common/configs/db.config';
import jwtConfig from './common/configs/jwt.config';
import mailerConfig from './common/configs/mailer.config';
import company from './common/configs/company.config';
import { OpenaiModule } from './modules/openai/openai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomListener } from './common/events/listeners/custom.listener';
import { TaxasModule } from './modules/taxas-e-servicos/taxas.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs/`);

@Module({
  imports: [
    AuthModule,
    OpenaiModule,
    WhatsappModule,
    ProdutosModule,
    PedidosModule,
    ClientesModule,
    TaxasModule,
    UsuarioModule,
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [openapi, dbconfig, jwtConfig, company, mailerConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbconfig.host'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<string>('mailerConfig.user'),
            pass: configService.get<string>('mailerConfig.pass'),
          },
        },
        defaults: {},
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomListener,
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
  ],
})
export class AppModule { }
