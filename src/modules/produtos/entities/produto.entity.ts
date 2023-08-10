import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";

export enum ProdutoProps {
    descricao = 'descricao',
    valor = 'valor'
}

export type ProdutoDocument = Produto & Document;

@Schema({ timestamps: true, collection: 'produtos' })
export class Produto extends Default {

    @Prop({ required: true })
    [ProdutoProps.descricao]: string;

    @Prop({ required: true })
    [ProdutoProps.valor]: number;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
ProdutoSchema.plugin(mongoosePaginate);