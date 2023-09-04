import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from 'src/common/entities/default.entity';
import { Endereco, EnderecoInterface } from 'src/common/entities/endereco.entity';
import { Client } from 'src/modules/clients/entities/client.entity';

export enum PedidoStatusEnum {
  pendente = 'pendente',
  empreparo = 'empreparo',
  despachado = 'despachado',
  cancelado = 'cancelado',
}

export interface ItemPedidoInterface {
  descricao: string,
  valor: number
}

export interface PedidoInterface {
  cliente: mongoose.Schema.Types.ObjectId;
  horaDespacho: string;
  isDeliver: boolean;
  items: ItemPedidoInterface[]
  endereco: EnderecoInterface;
  pagamento: {
    cartao: number;
    dinheiro: number;
    pix: number;
  }
  obs: string;
  status: PedidoStatusEnum;
}

abstract class ItemPedido implements ItemPedidoInterface {
  @Prop({ required: true })
  descricao: string;
  @Prop({ required: true })
  valor: number
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
export class Pedido extends Default implements PedidoInterface {
  @Prop({ required: true, ref: Client.name })
  cliente: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  horaDespacho: string;
  @Prop({ required: true, default: false })
  isDeliver: boolean;
  @Prop({ required: true })
  items: ItemPedido[];
  @Prop({ required: false })
  endereco: Endereco;
  @Prop({ required: true })
  pagamento: Pagamento;
  @Prop({ required: false, default: '' })
  obs: string;
  @Prop({ required: true })
  status: PedidoStatusEnum;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
PedidoSchema.plugin(mongoosePaginate);