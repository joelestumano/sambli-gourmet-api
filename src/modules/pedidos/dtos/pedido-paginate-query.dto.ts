import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";
import { Transform } from "class-transformer";
import { PedidoStatusEnum } from "../entities/pedido.entity";

export class PedidosPaginateQueryDto extends PaginateQueryDto {

    @ApiProperty({
        format: "date-time",
        description: '',
        example: '2023-12-31T18:23:02.500Z',
        required: false,
        default: '',
    })
    @IsOptional()
    @IsDateString()
    dateEnd: string;

    @ApiProperty({
        format: "date-time",
        description: '',
        example: '2023-08-27T18:23:02.500Z',
        required: false,
        default: '',
    })
    @IsOptional()
    @IsDateString()
    dateStart: string;

    @ApiProperty({
        description: 'status da ordem de pedido',
        example: PedidoStatusEnum.pendente,
        enum: PedidoStatusEnum,
        enumName: 'Status',
        required: false
    })
    @IsOptional()
    @IsEnum(PedidoStatusEnum)
    @Transform((status) => status.value.toLowerCase())
    status: PedidoStatusEnum;

}