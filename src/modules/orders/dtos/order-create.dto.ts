import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderInterface, OrderStatus } from '../entities/order.entity';
import { Transform } from 'class-transformer';

export class OrderCreateDto implements OrderInterface {
  @ApiProperty({
    description: 'nome do cliente',
    example: 'Cliente Fiel',
  })
  @IsNotEmpty({
    message: 'o nome do cliente deve ser informada',
  })
  @IsString()
  client: string;

  @ApiProperty({
    description: 'descrição da ordem do pedido',
    example: '',
  })
  @IsNotEmpty({
    message: 'a descrição da ordem do pedido deve ser informada',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'ordem do pedido',
    example: '0123456789',
  })
  @IsNotEmpty({
    message: 'a ordem do pedido deve ser informada',
  })
  @IsString()
  orderCode: string;

  @ApiProperty({
    description: 'status da ordem de pedido',
    example: OrderStatus.pending,
    enum: OrderStatus,
    enumName: 'Status',
  })
  @IsEnum(OrderStatus)
  @Transform((status) => status.value.toLowerCase())
  status: OrderStatus;

  @ApiProperty({
    description: 'whatsapp do cliente',
    example: '',
  })
  @IsNotEmpty({
    message: 'o whatsapp do cliente deve ser informado',
  })
  @IsString()
  whatsapp: string;
}
