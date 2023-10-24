import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Schema } from "mongoose";
import { IsItemId } from "src/modules/produtos/decorators/is-item-id.decorator";
import { ProdutoCreateDto } from "src/modules/produtos/dtos/produto-create.dto";

export class PedidoItemDto extends PickType(ProdutoCreateDto, ['valor'] as const) {
    @ApiProperty({
        description: '_id de registro do item',
        example: '64ff9310ac886b54ea28e4f9',
    })
    @IsNotEmpty({
        message: 'o _id de registro do item deve ser informado',
    })
    @IsItemId({
        message: 'verifique o _id do item'
    })
    _id: Schema.Types.ObjectId;
}