import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Default } from 'src/common/entities/default.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum TaxaServicoDescricaoEnum {
    entrega = 'entrega',
    cartaoCredito = 'cartaoCredito',
    cartaoDebito = 'cartaoDebito'
}

export interface TaxaServicoInterface {
    descricao: string;
    valor: number;
    label: string;
}

export type PedidoDocument = TaxaServico & Document;

@Schema({ timestamps: true, collection: 'taxaseservicos' })
export class TaxaServico extends Default implements TaxaServicoInterface {
    @Prop({ required: true, unique: true })
    descricao: string;
    @Prop({ required: true, default: 0 })
    valor: number;
    @Prop({ required: true, unique: true })
    label: string;
}

export const TaxasEServicosSchema = SchemaFactory.createForClass(TaxaServico);
TaxasEServicosSchema.plugin(mongoosePaginate);
