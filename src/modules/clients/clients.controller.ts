import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientCreateDto } from './dtos/client-create.dto';

@Controller('v1/clients')
@ApiTags('v1/clients')
export class ClientsController {

    constructor(private readonly clientsService: ClientsService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registro de um novo cliente',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async add(@Body() dto: ClientCreateDto) {
        return await this.clientsService.create(dto);
    }
}
