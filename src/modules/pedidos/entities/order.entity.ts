import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from 'src/common/entities/default.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { ProdutoInterface } from 'src/modules/produtos/entities/produto.entity';

export enum PedidoStatusEnum {
  pendente = 'pendente',
  empreparo = 'empreparo',
  despachado = 'despachado',
  cancelado = 'cancelado',
}

export interface OrderInterface {
  cliente: mongoose.Schema.Types.ObjectId;
  horaDespacho: string;
  isDeliver: boolean;
  //items: ProdutoInterface[]
  pagamento: {
    cartao: number;
    dinheiro: number;
    pix: number;
  }
  obs: string;
  status: PedidoStatusEnum;
}

abstract class Pagamento {
  @Prop({ required: true, default: 0 })
  cartao: number;
  @Prop({ required: true, default: 0 })
  dinheiro: number;
  @Prop({ required: true, default: 0 })
  pix: number;
}

export type PedidoDocument = Pedido & Document;

@Schema({ timestamps: true, collection: 'pedidos' })
export class Pedido extends Default implements OrderInterface {
  @Prop({ required: true, ref: Client.name })
  cliente: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  horaDespacho: string;
  @Prop({ required: true, default: false })
  isDeliver: boolean;
  @Prop({ required: true })
  items: ProdutoInterface[];
  @Prop({ required: true })
  pagamento: Pagamento;
  @Prop({ required: false, default: '' })
  obs: string;
  @Prop({ required: true })
  status: PedidoStatusEnum;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
PedidoSchema.plugin(mongoosePaginate);