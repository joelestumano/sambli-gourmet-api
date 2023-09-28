import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaxasEServicosService } from './taxas-e-servicos.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxasEServicosCreateDto } from './dtos/taxas-e-servicos-create.dto';
import { TaxasEServicoQueryDto } from './dtos/taxas-e-servicos-paginate-query.dto';

@Controller('v1/taxas-e-servicos')
@ApiTags('v1/taxas-e-servicos')
export class TaxasEServicosController {
    constructor(private readonly taxasEServicosService: TaxasEServicosService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra uma nova taxa ou serviço',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async add(@Body() dto: TaxasEServicosCreateDto) {
        return await this.taxasEServicosService.create(dto);
    }

    @Get('paginate')
    @ApiOperation({
      summary: 'lista taxas e serviços (paginado)',
      description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() dto: TaxasEServicoQueryDto) {
      return await this.taxasEServicosService.paginate(dto);
    }
}
