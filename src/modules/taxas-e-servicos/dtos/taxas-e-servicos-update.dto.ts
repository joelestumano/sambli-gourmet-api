import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TaxaServicoInterface } from "../entities/taxas-e-servicos.entity";

export class TaxaServicoUpdateDto implements TaxaServicoInterface {
    @ApiProperty({
        description: 'descricao da taxa ou serviço',
        example: 'entrega',
    })
    @IsOptional()
    @IsString()
    descricao: string;

    @ApiProperty({
        description: 'valor da taxa ou serviço ',
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    valor: number;
}