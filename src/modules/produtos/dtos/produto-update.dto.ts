import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProdutoUpdateDto {
    @ApiProperty({
        description: 'bannerUrl do produto',
        example: 'https://public/gourmet/img/a3014c9dea2915034be850bd2814dad3.png',
        required: false
    })
    @IsOptional()
    @IsString()
    bannerUrl: string

    @ApiProperty({
        description: 'descrição do produto',
        example: 'Bife',
        required: false
    })
    @IsOptional()
    @IsString()
    descricao: string;

    @ApiProperty({
        description: 'valor do produto',
        example: '1.12',
        required: false
    })
    @IsOptional()
    @IsNumber()
    valor: number;

    @ApiProperty({
        description: 'indica se o produto é ativo no sistema',
        example: true,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    active: boolean;
}