import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PedidoCreatedEvent } from '../events/pedido-created.event';

@Injectable()
export class PedidoCreatedListener {
  private readonly logger = new Logger(PedidoCreatedListener.name);

  @OnEvent('pedido.created')
  handlePedidoCreatedEvent(event: PedidoCreatedEvent) {
    this.logger.log({event});
  }
}
