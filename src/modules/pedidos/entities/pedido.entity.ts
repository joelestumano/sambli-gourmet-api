import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from 'src/common/entities/default.entity';
import { Endereco, EnderecoInterface } from 'src/common/entities/endereco.entity';
import { Cliente } from 'src/modules/clientes/entities/cliente.entity';

export enum PedidoStatusEnum {
  pendente = 'pendente',
  empreparo = 'empreparo',
  despachado = 'despachado',
  cancelado = 'cancelado',
  concluido = 'concluido',
}

export interface PedidoItemInterface {
  _id: mongoose.Schema.Types.ObjectId,
  valor: number
}

export interface PedidoTaxaInterface {
  _id: mongoose.Schema.Types.ObjectId,
  valor: number;
}

export interface PedidoInterface {
  cliente: mongoose.Schema.Types.ObjectId;
  horaDespacho: string;
  isDeliver: boolean;
  items: PedidoItemInterface[]
  endereco: EnderecoInterface;
  pagamento: {
    cartaoCredito: number;
    cartaoDebito: number;
    dinheiro: number;
    pix: number;
  }
  obs: string;
  status: PedidoStatusEnum;
  codigo?: string;
  taxas: PedidoTaxaInterface[];
  valorTotal: number;
}

abstract class PedidoItem implements PedidoItemInterface {
  @Prop({ required: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  valor: number
}

abstract class PedidoTaxa implements PedidoTaxaInterface {
  @Prop({ required: true })
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true, default: 0 })
  valor: number;
}

abstract class Pagamento {
  @Prop({ required: true, default: 0 })
  cartaoCredito: number;
  @Prop({ required: true, default: 0 })
  cartaoDebito: number;
  @Prop({ required: true, default: 0 })
  dinheiro: number;
  @Prop({ required: true, default: 0 })
  pix: number;
}

export type PedidoDocument = Pedido & Document;

@Schema({ timestamps: true, collection: 'pedidos' })
export class Pedido extends Default implements PedidoInterface {
  @Prop({ required: true, ref: Cliente.name })
  cliente: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  horaDespacho: string;
  @Prop({ required: true, default: false })
  isDeliver: boolean;
  @Prop({ required: true })
  items: PedidoItem[];
  @Prop({ required: false })
  endereco: Endereco;
  @Prop({ required: true })
  pagamento: Pagamento;
  @Prop({ required: false, default: '' })
  obs: string;
  @Prop({ required: true })
  status: PedidoStatusEnum;
  @Prop({ required: true, unique: true })
  codigo: string
  @Prop({ required: true })
  taxas: PedidoTaxa[];
  @Prop({ required: true })
  valorTotal: number;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
PedidoSchema.plugin(mongoosePaginate);