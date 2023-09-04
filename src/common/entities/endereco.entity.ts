import { Prop } from '@nestjs/mongoose';

export interface EnderecoInterface {
  logradouro: string;
  bairro: string;
  numero: string;
  complemento: string;
  principal: boolean;
};

export abstract class Endereco implements EnderecoInterface {
  @Prop({ required: true })
  logradouro: string;

  @Prop({})
  bairro: string;
  
  @Prop({})
  numero: string;

  @Prop({})
  complemento: string;

  @Prop({ required: true })
  principal: boolean;
}
