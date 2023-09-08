import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PedidoStatusEnum } from '../entities/pedido.entity';
import { Transform } from 'class-transformer';

export class PedidoUpdateDto {
    @ApiProperty({
        description: 'status do pedido',
        example: PedidoStatusEnum.pendente,
        enum: PedidoStatusEnum,
        enumName: 'status',
        required: false
    })
    @IsOptional()
    @IsEnum(PedidoStatusEnum)
    @Transform((status) => status.value.toLowerCase())
    status: PedidoStatusEnum;
}