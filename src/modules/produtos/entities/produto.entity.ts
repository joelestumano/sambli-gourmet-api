import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";

export type ProdutoDocument = Produto & Document;

@Schema({ timestamps: true, collection: 'produto' })
export class Produto extends Default {

    @Prop({ required: true })
    descricao: string;
}

export const ProdutoSchema = SchemaFactory.createForClass(Produto);
ProdutoSchema.plugin(mongoosePaginate);