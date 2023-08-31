import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { ClientCreateDto } from './dtos/client-create.dto';

@Controller('v1/client')
@ApiTags('v1/client')
export class ClientController {

    constructor(private readonly clientService: ClientService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registro de um novo cliente',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async add(@Body() dto: ClientCreateDto) {
        return await this.clientService.create(dto);
    }
}
