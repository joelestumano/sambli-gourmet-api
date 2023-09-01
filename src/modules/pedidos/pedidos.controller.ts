import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PedidosService } from './pedidos.service';
import { PedidoCreateDto } from './dtos/pedido-create.dto';

@Controller('v1/pedidos')
@ApiTags('v1/pedidos')
export class PedidosController {

    constructor(private readonly ordersService: PedidosService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registro de um novo pedido',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async add(@Body() dto: PedidoCreateDto) {
        return await this.ordersService.create(dto);
    }

    @Get('paginate')
    @ApiOperation({
        summary: 'busca ordens de pedido por período (paginado)',
        description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() query: PedidosPaginateQueryDto) {
        return await this.ordersService.paginate(query);
    }
}
