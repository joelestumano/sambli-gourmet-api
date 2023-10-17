import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PagamentoDto {
    @ApiProperty({
        description: 'valor no cartao de crédido',
    })
    @IsNumber()
    @Type(() => Number)
    cartaoCredito: number;
    @ApiProperty({
        description: 'valor no cartao de débito',
    })
    @IsNumber()
    @Type(() => Number)
    cartaoDebito: number;
    @ApiProperty({
        description: 'valor no dinheiro',
    })
    @IsNumber()
    @Type(() => Number)
    dinheiro: number;
    @ApiProperty({
        description: 'valor no pix',
    })
    @IsNumber()
    @Type(() => Number)
    pix: number;
}