import { PickType } from '@nestjs/swagger';
import { UsuarioCreateDto } from 'src/modules/usuario/dtos/usuario-create.dto';

export class ForgotPasswordDto extends PickType(UsuarioCreateDto, [
    'email',
] as const) { }
