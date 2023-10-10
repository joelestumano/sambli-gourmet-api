import { Body, Controller, Get, Param, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaxasEServicosService } from './taxas-e-servicos.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxasEServicoQueryDto } from './dtos/taxas-e-servicos-paginate-query.dto';
import { ParamIdDto } from 'src/common/dtos/param-id.dto';
import { TaxaServicoUpdateDto } from './dtos/taxas-e-servicos-update.dto';

@Controller('taxas-e-servicos')
@ApiTags('taxas-e-servicos')
export class TaxasEServicosController {
    constructor(private readonly taxasEServicosService: TaxasEServicosService) { }

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

    @Patch('update/:id')
    @ApiOperation({
        summary: 'atualiza informações de uma taxa serviço',
        description: 'atualiza uma taxa serviço',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async update(@Param() { id }: ParamIdDto,
        @Body() dto: TaxaServicoUpdateDto) {
        return await this.taxasEServicosService.update(id, dto);
    }
}
