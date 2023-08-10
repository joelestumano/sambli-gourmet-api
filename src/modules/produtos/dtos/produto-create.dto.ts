import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProdutoCreateDto {
  @ApiProperty({
    description: 'descrição do produto',
  })
  @IsNotEmpty({
    message: 'a descrição do produto deve ser informada',
  })
  @IsString()
  descricao: string;
}
