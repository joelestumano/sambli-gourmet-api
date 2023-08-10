import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { PaginateQueryProdutoDto } from './dtos/paginate-query-produto.dto';
import { ProdutoCreateDto } from './dtos/produto-create.dto';

@Controller('produtos')
@ApiTags('produtos')
export class ProdutosController {
    constructor(private readonly produtosService: ProdutosService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registro de um novo produto',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async add(@Body() dto: ProdutoCreateDto) {
        return await this.produtosService.create(dto);
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
}
