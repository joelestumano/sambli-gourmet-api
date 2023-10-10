import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { UsuarioCreateDto } from "src/modules/usuario/dtos/usuario-create.dto";

export class ResetPasswordDto extends PickType(UsuarioCreateDto, [
    'email',
    'password',
    'confirmPassword'
] as const) {
    @ApiProperty({
        description: 'token',
        example: '',
    })
    @IsNotEmpty({
        message: 'o token deve ser informado',
    })
    @IsString()
    token: string;
}