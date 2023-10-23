import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Default } from 'src/common/entities/default.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export enum TaxaRefEnum {
    ENTREGA = 'ENTREGA',
    CARTAO_CREDITO = 'CARTAO_CREDITO',
    CARTAO_DEBITO = 'CARTAO_DEBITO',
}

export enum TaxaTipEnum {
    INTERNA = 'INTERNA',
    EXTERNA = 'EXTERNA',
}

export interface TaxaInterface {
    referencia: TaxaRefEnum;
    descricao: string;
    valor: number;
    tipo: TaxaTipEnum;
}

export type TaxaDocument = Taxa & Document;

@Schema({ timestamps: true, collection: 'taxas' })
export class Taxa extends Default implements TaxaInterface {
    @Prop({ required: true, unique: true, enum: TaxaRefEnum })
    referencia: TaxaRefEnum;
    @Prop({ required: true, unique: true })
    descricao: string;
    @Prop({ required: true, default: 0 })
    valor: number;
    @Prop({ required: true, enum: TaxaTipEnum })
    tipo: TaxaTipEnum;
}

export const TaxaSchema = SchemaFactory.createForClass(Taxa);
TaxaSchema.plugin(mongoosePaginate);
