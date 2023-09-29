import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Schema } from "mongoose";
import { IsTaxasEServicosId } from "src/modules/taxas-e-servicos/decorators/is-taxas-e-servicos-id.decorator";
import { TaxaServicoCreateDto } from "src/modules/taxas-e-servicos/dtos/taxas-e-servicos-create.dto";

export class TaxaServicoDto extends PickType(TaxaServicoCreateDto, ['valor'] as const) {

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
} 