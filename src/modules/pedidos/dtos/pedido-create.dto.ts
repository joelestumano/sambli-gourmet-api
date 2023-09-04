import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PedidoInterface, PedidoStatusEnum } from '../entities/pedido.entity';
import { Transform, Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { IsClientId } from 'src/modules/clients/decorators/isClientId.decorator';
import { EnderecoDto } from 'src/common/dtos/endereco.dto';

class ItemPedidoDto {
  @ApiProperty({
    description: 'descrição do item do pedido',
    example: '',
  })
  @IsNotEmpty({
    message: 'a descrição do item deve ser informada',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'valor do item',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  valor: number;
}

class PagamentoDto {
  @ApiProperty({
    description: 'valor no cartao',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cartao: number;
  @ApiProperty({
    description: 'valor no dinheiro',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  dinheiro: number;
  @ApiProperty({
    description: 'valor no pix',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pix: number;
}

export class PedidoCreateDto implements PedidoInterface {
  @ApiProperty({
    description: '_id de registro do cliente',
    example: '64f0ebd13ba9f5b7171af5ca',
  })
  @IsNotEmpty({
    message: 'o _id de registro do cliente deve ser informado',
  })
  @IsClientId({
    message: 'verifique o _id do cliente',
  })
  cliente: Schema.Types.ObjectId;

  @ApiProperty({
    format: 'date-time',
    description: 'horário para despacho do pedido',
    example: '2023-12-31T18:23:02.500Z',
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
  isDeliver: boolean;

  @ApiProperty({
    description: 'itens do pedido',
    type: ItemPedidoDto,
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
  @Type(() => ItemPedidoDto)
  items: ItemPedidoDto[];

  @ApiProperty({
    description: 'endereço para entrega',
  })
  @IsOptional()
  @ValidateNested({
    message: 'verifique o endereço informado',
  })
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @ApiProperty({
    description: 'valores de pagamento',
  })
  @IsNotEmpty({
    message: 'pagamento deve ser informado',
  })
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
  @IsEnum(PedidoStatusEnum)
  @Transform((status) => status.value.toLowerCase())
  status: PedidoStatusEnum;
}
