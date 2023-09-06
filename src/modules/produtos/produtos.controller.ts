import { Body, Controller, Get, Param, Patch, Post, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { PaginateQueryProdutoDto } from './dtos/produto-paginate-query.dto';
import { ProdutoCreateDto } from './dtos/produto-create.dto';
import { ProdutoUpdateDto } from './dtos/produto-update.dto';
import { ParamIdDto } from '../../common/dtos/param-id.dto';
import { fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('v1/produtos')
@ApiTags('v1/produtos')
export class ProdutosController {
    constructor(private readonly produtosService: ProdutosService,
        private eventEmitter2: EventEmitter2) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra novo produto',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async create(@Body() dto: ProdutoCreateDto) {
        return await this.produtosService.create(dto);
    }

    @Sse('changed')
    @ApiOperation({
        summary: 'evento enviado pelo servidor acionado a cada atualização de produto',
        description: 'evento enviado pelo servidor'
    })
    changed() {
        return fromEvent(this.eventEmitter2, 'produtos-changed')
            .pipe(map((event) => ({ data: { event } })));
    }

    @Get('paginate')
    @ApiOperation({
        summary: 'busca produtos por descrição (paginado)',
        description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() query: PaginateQueryProdutoDto) {
        return await this.produtosService.paginate(query);
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'atualiza informações de um produto',
        description: 'atualiza um produto',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async update(@Param() { id }: ParamIdDto,
        @Body() dto: ProdutoUpdateDto) {
        return await this.produtosService.update(id, dto);
    }
}
