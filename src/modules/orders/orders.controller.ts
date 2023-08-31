import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateQueryOrderDto } from './dtos/paginate-query-order.dto';
import { OrdersService } from './orders.service';
import { PedidoCreateDto } from './dtos/order-create.dto';

@Controller('v1/orders')
@ApiTags('v1/orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) { }

    @Get('paginate')
    @ApiOperation({
        summary: 'busca ordens de pedido por período (paginado)',
        description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() query: PaginateQueryOrderDto) {
        return await this.ordersService.paginate(query);
    }

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
}
