import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProdutoCreateDto {
  @ApiProperty({
    description: 'bannerUrl do produto',
    example: 'https://joelestumano.github.io/public/sambli-gourmet/img/a3014c9dea2915034be850bd2814dad3.png',
  })
  @IsNotEmpty({
    message: 'o bannerUrl do produto deve ser informado',
  })
  @IsString()
  bannerUrl: string

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
