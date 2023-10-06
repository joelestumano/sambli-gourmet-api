import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PagamentoDto {
    @ApiProperty({
        description: 'valor no cartao de crédido',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    cartaoCredito: number;
    @ApiProperty({
        description: 'valor no cartao de débito',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    cartaoDebito: number;
    @ApiProperty({
        description: 'valor no dinheiro',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    dinheiro: number;
    @ApiProperty({
        description: 'valor no pix',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    pix: number;
}