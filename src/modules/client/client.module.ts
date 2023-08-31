import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client.entity';

@Module({
  controllers: [ClientController],
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  providers: [ClientService]
})
export class ClientModule { }
