import { Module } from '@nestjs/common';
import { PedidosController as PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './entities/pedido.entity';
import { IsPagamentoValidConstraint } from './decorators/suma-items-valores-constraint.decorator';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, IsPagamentoValidConstraint],
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    WhatsappModule,
    ClientesModule
  ],
  exports: [PedidosService],
})
export class PedidosModule { }
