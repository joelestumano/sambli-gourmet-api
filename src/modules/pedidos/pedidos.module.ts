import { Module } from '@nestjs/common';
import { PedidosController as PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './entities/pedido.entity';
import { IsPagamentoValidConstraint } from './decorators/suma-items-valores-constraint.decorator';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ClientesModule } from '../clientes/clientes.module';
import { TaxasEServicosModule } from '../taxas-e-servicos/taxas-e-servicos.module';
import { IsValidIsDeliverConstraint } from './decorators/is-valid-is-deliver-constraint.decorator';
import { IsValidValorTotalConstraint } from './decorators/is-valid-valor-total-constraint.decorator';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, IsPagamentoValidConstraint, IsValidIsDeliverConstraint, IsValidValorTotalConstraint],
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    WhatsappModule,
    ClientesModule,
    TaxasEServicosModule
  ],
  exports: [PedidosService],
})
export class PedidosModule { }
