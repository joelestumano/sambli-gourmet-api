import { Prop } from '@nestjs/mongoose';

export abstract class Endereco {
  @Prop({ required: true })
  logradouro: string;

  @Prop({})
  numero: string;

  @Prop({})
  complemento: string;

  @Prop({})
  bairro: string;

  @Prop({ required: true })
  cidade: string;

  @Prop({})
  cep: string;

  @Prop({ required: true })
  uf: string;
}
