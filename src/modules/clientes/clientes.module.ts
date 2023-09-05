import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/cliente.entity';
import { IsClienteIdValidatorConstraint } from './decorators/isClienteId.decorator';

@Module({
  controllers: [ClientesController],
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  providers: [ClientesService, IsClienteIdValidatorConstraint]
})
export class ClientesModule { }
