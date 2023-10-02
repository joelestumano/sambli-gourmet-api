import { Body, Controller, Get, Param, Patch, Post, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PedidosService } from './pedidos.service';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { ParamIdDto } from 'src/common/dtos/param-id.dto';
import { PedidoUpdateDto } from './dtos/pedido-update.dto';
import { PedidoUpdateStatusDto } from './dtos/pedido-update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('v1/pedidos')
@ApiTags('v1/pedidos')
//@UseGuards(JwtAuthGuard)
export class PedidosController {

    constructor(private readonly pedidoService: PedidosService) { }

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

    @Patch('update-status/:id')
    @ApiOperation({
        summary: 'atualiza informações de status de um pedido',
        description: 'atualiza status de um pedido',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async updateStatus(@Param() { id }: ParamIdDto,
        @Body() dto: PedidoUpdateStatusDto) {
        return await this.pedidoService.updateStatus(id, dto);
    }
}
