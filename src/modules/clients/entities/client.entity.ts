import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";
import { EnderecoInterface } from "src/common/entities/endereco.entity";

export interface ClientInterface {
    name: string;
    whatsapp: string;
    enderecos: EnderecoInterface[];
}

export type ClientDocument = Client & Document;

@Schema({ timestamps: true, collection: 'clients' })
export class Client extends Default implements ClientInterface {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    whatsapp: string;
    @Prop({ required: false })
    enderecos: EnderecoInterface[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.plugin(mongoosePaginate);