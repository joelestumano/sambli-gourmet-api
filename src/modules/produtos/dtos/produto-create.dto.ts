import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProdutoProps } from '../entities/produto.entity';

export class ProdutoCreateDto {
  @ApiProperty({
    description: 'descrição do produto',
    example: '',
  })
  @IsNotEmpty({
    message: 'a descrição do produto deve ser informada',
  })
  @IsString()
  [ProdutoProps.descricao]: string;

  @ApiProperty({
    description: 'valor do produto',
    example: '25.50',
  })
  @IsNotEmpty({
    message: 'o valor do produto deve ser informado',
  })
  @IsNumber()
  [ProdutoProps.valor]: number;
}
