import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Schema } from "mongoose";
import { IsTaxasId } from "src/modules/taxas-e-servicos/decorators/is-taxa-id.decorator";
import { TaxaCreateDto } from "src/modules/taxas-e-servicos/dtos/taxa-create.dto";

export class PedidoTaxaDto extends PickType(TaxaCreateDto, ['referencia', 'valor'] as const) {

    @ApiProperty({
        description: '_id de registro da taxa',
        example: '64ff9310ac886b54ea28e4f9',
    })
    @IsNotEmpty({
        message: 'o _id de registro da taxa deve ser informado',
    })
    @IsTaxasId({
        message: 'verifique o _id da taxa',
    })
    _id: Schema.Types.ObjectId;
} 