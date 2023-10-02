import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Default } from 'src/common/entities/default.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export interface UsuarioInterface {
    nome: string;
    email: string;
    whatsapp: string;
    securityToken?: string;
    password: string;
}

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario extends Default implements UsuarioInterface {
    @Prop({ required: true })
    nome: string;
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    whatsapp: string;
    @Prop({ required: true })
    securityToken: string;
    @Prop({ required: true })
    password: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
UsuarioSchema.plugin(mongoosePaginate);
