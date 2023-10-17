import { ApiProperty } from "@nestjs/swagger";
import { TaxaServicoInterface } from "../entities/taxas-e-servicos.entity";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class TaxaServicoCreateDto implements TaxaServicoInterface {
    @ApiProperty({
        description: 'descricao da taxa ou serviço',
        example: 'entrega',
    })
    @IsNotEmpty({
        message: 'a descricao da taxa ou serviço deve ser informada',
    })
    @IsString()
    descricao: string;

    @ApiProperty({
        description: 'valor da taxa ou serviço ',
    })
    @IsNumber()
    @IsNotEmpty({
        message: 'o valor da taxa ou serviço deve ser informado',
    })
    @Type(() => Number)
    valor: number;

    @ApiProperty({
        description: 'label',
        example: 'taxa de entrega',
    })
    @IsNotEmpty({
        message: 'o label deve ser informado',
    })
    @IsString()
    label: string;
}