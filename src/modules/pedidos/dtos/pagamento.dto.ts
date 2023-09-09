import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PagamentoDto {
    @ApiProperty({
        description: 'valor no cartao',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    cartao: number;
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