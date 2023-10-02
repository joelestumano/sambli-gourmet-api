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
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomListener } from './common/events/listeners/custom.listener';
import { TaxasEServicosModule } from './modules/taxas-e-servicos/taxas-e-servicos.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/auth/auth.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs/`);

@Module({
  imports: [
    AuthModule,
    OpenaiModule,
    WhatsappModule,
    ProdutosModule,
    PedidosModule,
    ClientesModule,
    TaxasEServicosModule,
    UsuarioModule,
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
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, CustomListener],
})
export class AppModule { }
