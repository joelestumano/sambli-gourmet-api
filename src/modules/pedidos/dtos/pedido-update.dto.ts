import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PedidoInterface, PedidoStatusEnum } from '../entities/pedido.entity';
import { Transform, Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { IsClienteId } from 'src/modules/clientes/decorators/is-clienteId.decorator';
import { ItemPedidoDto } from './item-pedido.dto';
import { EnderecoPedidoDto } from './endereco-pedido.dto';
import { PagamentoDto } from './pagamento.dto';


export class PedidoUpdateDto implements PedidoInterface {
    @ApiProperty({
        description: '_id de registro do cliente',
        example: '64f764ae018dc9c9c2681bf7',
    })
    @IsOptional()
    @IsClienteId({
        message: 'verifique o _id do cliente',
    })
    cliente: Schema.Types.ObjectId;

    @ApiProperty({
        format: 'date-time',
        description: 'horário para despacho do pedido',
        example: '2023-12-31 18:23:02.000',
        required: true,
        default: '',
    })
    @IsOptional()
    @IsDateString()
    horaDespacho: string;

    @ApiProperty({
        description: 'indicador para entrega do pedido',
        example: false,
    })
    @IsOptional()
    isDeliver: boolean;

    @ApiProperty({
        description: 'itens do pedido',
        type: ItemPedidoDto,
        isArray: true,
    })
    @IsOptional()
    @ValidateNested({
        message: 'verifique os itens do pedido',
        each: true,
    })
    @Type(() => ItemPedidoDto)
    items: ItemPedidoDto[];

    @ApiProperty({
        description: 'endereço para entrega',
        required: false
    })
    @IsOptional()
    @ValidateNested({
        message: 'verifique o endereço informado',
    })
    @Type(() => EnderecoPedidoDto)
    endereco: EnderecoPedidoDto;

    @ApiProperty({
        description: 'valores de pagamento',
    })
    @IsOptional()
    @ValidateNested({
        message: 'verifique o pagamento informado',
    })
    @Type(() => PagamentoDto)
    pagamento: PagamentoDto;

    @ApiProperty({
        description: 'observações acerca do pedido',
        example: '',
    })
    @IsString()
    @IsOptional()
    obs: string;

    @ApiProperty({
        description: 'status do pedido',
        example: PedidoStatusEnum.pendente,
        enum: PedidoStatusEnum,
        enumName: 'status',
    })
    @IsOptional()
    @IsEnum(PedidoStatusEnum)
    @Transform((status) => status.value.toLowerCase())
    status: PedidoStatusEnum;
}