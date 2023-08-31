import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client.entity';
import { IsClientIdValidatorConstraint } from './decorators/isClientId.decorator';

@Module({
  controllers: [ClientsController],
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  providers: [ClientsService, IsClientIdValidatorConstraint]
})
export class ClientsModule { }
