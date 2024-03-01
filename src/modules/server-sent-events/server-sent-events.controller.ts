import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiPublicEndpoint } from '../auth/decorators/api-public-endpoint.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { fromEvent, map } from 'rxjs';

@Controller('server-sent-events')
@ApiTags('server-sent-events')
export class ServerSentEventsController {
    constructor(private eventEmitter2: EventEmitter2) { }

    @ApiPublicEndpoint()
    @Sse('changed-collection')
    @ApiOperation({
        summary: 'evento enviado pelo servidor',
        description: 'evento enviado pelo servidor',
    })
    changedCollection() {
        return fromEvent(this.eventEmitter2, 'changed-collection').pipe(
            map((event) => ({ data: { event } })),
        );
    }
}
