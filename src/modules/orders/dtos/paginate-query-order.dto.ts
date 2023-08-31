import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";
import { PedidoStatusEnum } from "../entities/order.entity";
import { Transform } from "class-transformer";

export class PaginateQueryOrderDto extends PaginateQueryDto {

    @ApiProperty({
        format: "date-time",
        description: '',
        example: '2023-08-28T18:23:02.500Z',
        required: true,
        default: '',
    })
    @IsDateString()
    dateEnd: string;

    @ApiProperty({
        format: "date-time",
        description: '',
        example: '2023-08-27T18:23:02.500Z',
        required: true,
        default: '',
    })
    @IsDateString()
    dateStart: string;

    @ApiProperty({
        description: 'status da ordem de pedido',
        example: PedidoStatusEnum.pendente,
        enum: PedidoStatusEnum,
        enumName: 'Status',
    })
    @IsEnum(PedidoStatusEnum)
    @Transform((status) => status.value.toLowerCase())
    status: PedidoStatusEnum;
}