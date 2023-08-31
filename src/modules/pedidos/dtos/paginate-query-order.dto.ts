import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";
import { PedidoStatusEnum } from "../entities/order.entity";
import { Transform } from "class-transformer";

export enum PedidoStatusPaginateQueryEnum {
    todos = 'todos',
    pendente = 'pendente',
    empreparo = 'empreparo',
    despachado = 'despachado',
    cancelado = 'cancelado',
  }

export class PedidosPaginateQueryDto extends PaginateQueryDto {

    @ApiProperty({
        format: "date-time",
        description: '',
        example: '2023-12-31T18:23:02.500Z',
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
        example: PedidoStatusPaginateQueryEnum.todos,
        enum: PedidoStatusPaginateQueryEnum,
        enumName: 'Status',
    })
    @IsEnum(PedidoStatusPaginateQueryEnum)
    @Transform((status) => status.value.toLowerCase())
    status: PedidoStatusPaginateQueryEnum;

    @ApiProperty({
        description: 'use true para ignorar paginacao',
        example: true,
        required: false,
        default: false,
    })
    @Transform((t: any) => !(t.value === 'true' || t.value === true || t.value === 1 || t.value === '1'))
    ignorarPaginacao: boolean;
}