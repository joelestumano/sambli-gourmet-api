import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from 'src/common/entities/default.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { ProdutoInterface } from 'src/modules/produtos/entities/produto.entity';

export enum OrderStatus {
  canceled = 'canceled',
  delivered = 'delivered',
  inprogress = 'inprogress',
  pending = 'pending',
}

export interface OrderInterface__ {
  client: string;
  descricao: string;
  orderCode: string;
  status: OrderStatus;
  whatsapp: string;
}

export interface OrderInterface {
  cliente: mongoose.Schema.Types.ObjectId;
  horaEntrega: string;
  isDeliver: boolean;
  items: ProdutoInterface[]
  pagamento: {
    cartao: number;
    dinheiro: number;
    pix: number;
  }
  obs: string;
  status: OrderStatus;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order extends Default implements OrderInterface__ {
  @Prop({ required: true })
  client: string;
  @Prop({ required: true })
  descricao: string;
  @Prop({ required: true })
  orderCode: string;
  @Prop({ required: true })
  status: OrderStatus;
  @Prop({ required: true })
  whatsapp: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(mongoosePaginate);

/**
 * todo pedido
 */

abstract class Pagamento {
  @Prop({ required: true, default: 0 })
  cartao: number;
  @Prop({ required: true, default: 0 })
  dinheiro: number;
  @Prop({ required: true, default: 0 })
  pix: number;
}

export type PedidoDocument = Order & Document;

@Schema({ timestamps: true, collection: 'pedidos' })
export class Pedido extends Default implements OrderInterface {
  @Prop({ required: true, ref: Client.name })
  cliente: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  horaEntrega: string;
  @Prop({ required: true, default: false })
  isDeliver: boolean;
  @Prop({ required: true })
  items: ProdutoInterface[];
  @Prop({ required: true })
  pagamento: Pagamento;
  @Prop({ required: false })
  obs: string;
  @Prop({ required: true })
  status: OrderStatus;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
PedidoSchema.plugin(mongoosePaginate);