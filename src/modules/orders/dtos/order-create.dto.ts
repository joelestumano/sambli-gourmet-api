import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderInterface, PedidoStatusEnum } from '../entities/order.entity';
import { Transform, Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { IsClientId } from 'src/modules/clients/decorators/isClientId.decorator';

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
  pix: number
}

export class PedidoCreateDto implements OrderInterface {
  @ApiProperty({
    description: '_id de registro do cliente',
    example: '64d510369c5733c69a5d367c',
  })
  @IsNotEmpty({
    message: 'o _id de registro do cliente deve ser informado',
  })
  @IsMongoId()
  @IsClientId({
    message: 'verifique o _id do cliente',
  })
  cliente: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'horário para despacho do pedido',
    example: '11:30',
  })
  @IsNotEmpty({
    message: 'horário para despacho do pedido deve ser informado',
  })
  @IsString()
  horaDespacho: string;

  @ApiProperty({
    description: 'indicador para entrega do pedido',
    example: false,
  })
  @IsNotEmpty({
    message: 'isDeliver deve ser informado',
  })
  isDeliver: boolean;

  //items: ProdutoInterface[];
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
    enumName: 'Status',
  })
  @IsEnum(PedidoStatusEnum)
  @Transform((status) => status.value.toLowerCase())
  status: PedidoStatusEnum;
}
