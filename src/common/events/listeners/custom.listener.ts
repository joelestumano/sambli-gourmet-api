import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomEvent } from '../custom.event';

@Injectable()
export class CustomListener {
  private readonly logger = new Logger(CustomListener.name);

  @OnEvent('changed-collection')
  handleCustomEvent(event: CustomEvent) {
    this.logger.log({ event });
  }
}
