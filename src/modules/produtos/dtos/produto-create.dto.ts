import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProdutoCreateDto {
  @ApiProperty({
    description: 'descrição do produto',
    example: 'Bife',
  })
  @IsNotEmpty({
    message: 'a descrição do produto deve ser informada',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'valor do produto',
    example: '1.12',
  })
  @IsNotEmpty({
    message: 'o valor do produto deve ser informado',
  })
  @IsNumber()
  valor: number;
}