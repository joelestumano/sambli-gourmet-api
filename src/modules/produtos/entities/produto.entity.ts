import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";

export interface ProdutoInterface {
    descricao: string,
    valor: number
}

export type ProdutoDocument = Produto & Document;

@Schema({ timestamps: true, collection: 'produtos' })
export class Produto extends Default implements ProdutoInterface{
    @Prop({ required: true })
    descricao: string;

    @Prop({ required: true })
    valor: number;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
ProdutoSchema.plugin(mongoosePaginate);