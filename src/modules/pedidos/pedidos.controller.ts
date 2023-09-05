import { Body, Controller, Get, Post, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PedidosService } from './pedidos.service';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('v1/pedidos')
@ApiTags('v1/pedidos')
export class PedidosController {

    constructor(private readonly ordersService: PedidosService,
        private eventEmitter2: EventEmitter2) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra novo pedido',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: PedidoCreateDto) {
        return await this.ordersService.create(dto);
    }

    @Sse('create-notifier')
    @ApiOperation({
        summary: 'evento enviado pelo servidor acionado a cada novo pedido',
        description: 'evento enviado pelo servidor'
    })
    createNotifier() {
        return fromEvent(this.eventEmitter2, 'pedido.created')
            .pipe(map((event) => ({ data: { event } })));
    }

    @Get('paginate')
    @ApiOperation({
        summary: 'busca pedidos por período (paginado)',
        description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() query: PedidosPaginateQueryDto) {
        return await this.ordersService.paginate(query);
    }
}
