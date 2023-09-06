import { Body, Controller, Get, Param, Patch, Post, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PedidosService } from './pedidos.service';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParamIdDto } from 'src/common/dtos/param-id.dto';
import { PedidoUpdateDto } from './dtos/pedido-update.dto';

@Controller('v1/pedidos')
@ApiTags('v1/pedidos')
export class PedidosController {

    constructor(private readonly pedidoService: PedidosService,
        private eventEmitter2: EventEmitter2) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra novo pedido',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: PedidoCreateDto) {
        return await this.pedidoService.create(dto);
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
        return await this.pedidoService.paginate(query);
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'atualiza informações de um pedido',
        description: 'atualiza um pedido',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async update(@Param() { id }: ParamIdDto,
        @Body() dto: PedidoUpdateDto) {
        return await this.pedidoService.update(id, dto);
    }
}
