import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Default } from "src/common/entities/default.entity";

export type AddressInterface = {
    logradouro: string;
    bairro: string;
    numero: string;
    complemento: string;
    principal: boolean;
};

export interface ClientInterface {
    name: string;
    whatsapp: string;
    adresses: AddressInterface[];
}

export type ClientDocument = Client & Document;

@Schema({ timestamps: true, collection: 'clients' })
export class Client extends Default implements ClientInterface {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    whatsapp: string;
    @Prop({ required: false })
    adresses: AddressInterface[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.plugin(mongoosePaginate);