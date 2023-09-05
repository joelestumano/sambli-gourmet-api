import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomEvent } from '../../../common/events/pedido-created.event';

@Injectable()
export class ProdutoUpdatedListener {
  private readonly logger = new Logger(ProdutoUpdatedListener.name);

  @OnEvent('produto.updated')
  handleProdutoUpdatedEvent(event: CustomEvent) {
    this.logger.log({ event });
  }
}
