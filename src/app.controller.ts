import { Controller, Get, Redirect, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('v1/app')
@ApiTags('v1/app')
export class AppController {
  constructor(private readonly appService: AppService,private eventEmitter2: EventEmitter2) {}

  @ApiExcludeEndpoint()
  @Get()
  @Redirect('docs', 200)
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('changed-collection')
  @ApiOperation({
      summary: 'evento enviado pelo servidor',
      description: 'evento enviado pelo servidor'
  })
  changedCollection() {
      return fromEvent(this.eventEmitter2, 'changed-collection')
          .pipe(map((event) => ({ data: { event } })));
  } 
}
