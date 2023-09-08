import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";
import { EnderecoInterface } from "src/common/entities/endereco.entity";

export interface ClienteInterface {
    nome: string;
    whatsapp: string;
    enderecos: EnderecoInterface[];
}

export type ClienteDocument = Cliente & Document;

@Schema({ timestamps: true, collection: 'clientes' })
export class Cliente extends Default implements ClienteInterface {
    @Prop({ required: true })
    nome: string;
    @Prop({ required: true })
    whatsapp: string;
    @Prop({ required: false })
    enderecos: EnderecoInterface[];
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
ClienteSchema.plugin(mongoosePaginate);