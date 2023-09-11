import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './entities/cliente.entity';
import { IsClienteIdValidatorConstraint } from './decorators/is-clienteId.decorator';

@Module({
  controllers: [ClientesController],
  imports: [MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }])],
  providers: [ClientesService, IsClienteIdValidatorConstraint]
})
export class ClientesModule { }
