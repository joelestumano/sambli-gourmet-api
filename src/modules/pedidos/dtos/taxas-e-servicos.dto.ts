import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Schema } from "mongoose";
import { IsTaxasEServicosId } from "src/modules/taxas-e-servicos/decorators/is-taxas-e-servicos-id.decorator";
import { TaxaServicoInterface } from "../entities/pedido.entity";

export class TaxaServicoDto implements TaxaServicoInterface {
    @ApiProperty({
        description: '_id de registro de taxa ou serviço',
        example: '64ff9310ac886b54ea28e4f9',
    })
    @IsNotEmpty({
        message: 'o _id de registro de taxa ou serviço deve ser informado',
    })
    @IsTaxasEServicosId({
        message: 'verifique o _id de taxa ou serviço',
    })
    taxaServico: Schema.Types.ObjectId;

    @ApiProperty({
        description: 'valor da taxa serviço',
    })
    @IsNumber()
    @IsNotEmpty({
        message: 'o valor da taxa serviço deve ser informado',
    })
    @Type(() => Number)
    valor: number;
}