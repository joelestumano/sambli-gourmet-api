import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TaxasEServicosService } from './taxas-e-servicos.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaxasEServicosCreateDto } from './dtos/taxas-e-servicos-create.dto';

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
}
