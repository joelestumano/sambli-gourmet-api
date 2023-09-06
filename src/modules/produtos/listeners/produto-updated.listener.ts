import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomEvent } from '../../../common/events/custom-event.event';

@Injectable()
export class ProdutoUpdatedListener {
  private readonly logger = new Logger(ProdutoUpdatedListener.name);

  @OnEvent('produtos-changed')
  handleProdutosChangedEvent(event: CustomEvent) {
    this.logger.log({ event });
  }
}
