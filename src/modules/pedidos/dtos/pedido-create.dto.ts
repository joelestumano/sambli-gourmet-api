import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PedidoInterface, PedidoStatusEnum } from '../entities/pedido.entity';
import { Transform, Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { IsClienteId } from 'src/modules/clientes/decorators/is-clienteId.decorator';
import { PedidoItemDto } from './item-pedido.dto';
import { EnderecoPedidoDto } from './endereco-pedido.dto';
import { PagamentoDto } from './pagamento.dto';
import { IsPagamentoValid } from '../decorators/suma-items-valores-constraint.decorator';
import { PedidoTaxaDto } from './taxa-servico.dto';
import { IsValidIsDeliver } from '../decorators/is-valid-is-deliver-constraint.decorator';
import { IsValidValorTotal } from '../decorators/is-valid-valor-total-constraint.decorator';

export class PedidoCreateDto implements PedidoInterface {
  @ApiProperty({
    description: '_id de registro do cliente',
    example: '64ff9310ac886b54ea28e4f9',
  })
  @IsNotEmpty({
    message: 'o _id de registro do cliente deve ser informado',
  })
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
  @IsNotEmpty({
    message: 'horário para despacho do pedido deve ser informado',
  })
  @IsDateString()
  horaDespacho: string;

  @ApiProperty({
    description: 'indicador para entrega do pedido',
    example: false,
  })
  @IsNotEmpty({
    message: 'isDeliver deve ser informado',
  })
  @IsValidIsDeliver()
  isDeliver: boolean;

  @ApiProperty({
    description: 'itens do pedido',
    type: PedidoItemDto,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'ao menos 1 item deve ser informado',
  })
  @ValidateNested({
    message: 'verifique os itens do pedido',
    each: true,
  })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];

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
  @IsNotEmpty({
    message: 'pagamento deve ser informado',
  })
  @ValidateNested({
    message: 'verifique o pagamento informado',
  })
  //@IsPagamentoValid({ message: 'os valores de pagamento deve corresponder aos valores dos items' })
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
  @IsEnum(PedidoStatusEnum)
  @Transform((status) => status.value.toLowerCase())
  status: PedidoStatusEnum;

  @ApiProperty({
    description: 'taxas',
    type: PedidoTaxaDto,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({
    message: 'verifique as informações de taxas',
    each: true,
  })
  @Type(() => PedidoTaxaDto)
  taxas: PedidoTaxaDto[];

  @ApiProperty({
    description: 'valor total do pedido',
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'verifique as informações do valor total do pedido',
  })
  @Type(() => Number)
  /* @IsValidValorTotal({
    message: 'o valor total do pedido deve corresponder a soma de todos valores correspondentes ao pedido'
  }) */
  valorTotal: number;
}
