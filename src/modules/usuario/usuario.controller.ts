import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioCreateDto } from './dtos/usuario-create.dto';
import { UsuarioService } from './usuario.service';

@Controller('v1/usuario')
@ApiTags('v1/usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) { }

    @Post('create')
    @ApiOperation({
        summary: 'registra novo pedido',
        description: 'create',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: UsuarioCreateDto) {
        return await this.usuarioService.create(dto);
    }
}
