import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from 'src/common/entities/default.entity';

export enum OrderStatus {
  canceled = 'canceled',
  delivered = 'delivered',
  inprogress = 'inprogress',
  pending = 'pending',
}

export interface OrderInterface {
  client: string;
  descricao: string;
  orderCode: string;
  status: OrderStatus;
  whatsapp: string;
}

export interface OrderInterface_ {
  cliente: string;
  prontaEntrega: string;
  isDelivery: boolean;

  pagamento: {
    cartao: number;
    dinheiro: number;
    pix: number;
  }


  descricao: string;
  
  status: OrderStatus;
  whatsapp: string;

  
  orderCode: string;
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order extends Default implements OrderInterface {
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
