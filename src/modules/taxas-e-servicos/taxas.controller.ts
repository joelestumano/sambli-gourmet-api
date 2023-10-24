import { Body, Controller, Get, Param, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaxasService } from './taxas.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxasPaginateQueryDto } from './dtos/taxas-paginate-query.dto';
import { ParamIdDto } from 'src/common/dtos/param-id.dto';
import { TaxaUpdateDto } from './dtos/taxa-update.dto';

@Controller('taxas')
@ApiTags('taxas')
export class TaxasController {
    constructor(private readonly taxasService: TaxasService) { }

    @Get('paginate')
    @ApiOperation({
      summary: 'lista taxas (paginado)',
      description: 'lista paginado'
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async paginate(@Query() dto: TaxasPaginateQueryDto) {
      return await this.taxasService.paginate(dto);
    }

    @Patch('update/:id')
    @ApiOperation({
        summary: 'atualiza informações de uma taxa',
        description: 'atualiza uma taxa',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    async update(@Param() { id }: ParamIdDto,
        @Body() dto: TaxaUpdateDto) {
        return await this.taxasService.update(id, dto);
    }
}
