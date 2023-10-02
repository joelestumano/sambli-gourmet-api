import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { ClienteCreateDto } from './dtos/cliente-create.dto';
import { ClientPaginateQueryDto } from './dtos/cliente-paginate-query.dto';
import { ClienteUpdateDto } from './dtos/cliente-update.dto';
import { ParamIdDto } from 'src/common/dtos/param-id.dto';

@Controller('v1/clientes')
@ApiTags('v1/clientes')
export class ClientesController {

    constructor(private readonly clientesService: ClientesService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra novo cliente',
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

    @Patch('update/:id')
    @ApiOperation({
        summary: 'atualiza informações de um cliente',
        description: 'atualiza um cliente',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async update(@Param() { id }: ParamIdDto,
        @Body() dto: ClienteUpdateDto) {
        return await this.clientesService.update(id, dto);
    }
}
