import { Module } from '@nestjs/common';
import { ServerSentEventsController } from './server-sent-events.controller';
import { CustomListener } from 'src/common/events/listeners/custom.listener';

@Module({
  controllers: [ServerSentEventsController],
  providers: [CustomListener]
})
export class ServerSentEventsModule {}
