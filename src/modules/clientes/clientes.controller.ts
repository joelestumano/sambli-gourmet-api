import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { ClienteCreateDto } from './dtos/cliente-create.dto';
import { ClientPaginateQueryDto } from './dtos/cliente-paginate-query.dto';

@Controller('v1/clients')
@ApiTags('v1/clients')
export class ClientesController {

    constructor(private readonly clientesService: ClientesService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registro de um novo cliente',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async add(@Body() dto: ClienteCreateDto) {
        return await this.clientesService.create(dto);
    }

    @Get('paginate')
    @ApiOperation({
      summary: 'busca clientes por nome (paginado)',
      description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() dto: ClientPaginateQueryDto) {
      return await this.clientesService.paginate(dto);
    }
}
