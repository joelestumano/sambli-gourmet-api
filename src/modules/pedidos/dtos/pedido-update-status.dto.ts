import { PickType } from '@nestjs/swagger';
import { PedidoUpdateDto } from './pedido-update.dto';

export class PedidoUpdateStatusDto extends PickType(PedidoUpdateDto, ['status'] as const) { }
