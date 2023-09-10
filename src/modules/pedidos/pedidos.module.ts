import { Module } from '@nestjs/common';
import { PedidosController as PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './entities/pedido.entity';
import { IsPagamentoValidConstraint } from './decorators/suma-items-valores-constraint.decorator';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, IsPagamentoValidConstraint],
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
  ],
  exports: [PedidosService],
})
export class PedidosModule { }
