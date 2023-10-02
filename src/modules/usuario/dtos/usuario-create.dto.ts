import { ApiProperty } from '@nestjs/swagger';
import { Usuario, UsuarioInterface } from '../entities/usuario.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { MatchPassword } from '../decorators/match-password.decorator';

export class UsuarioCreateDto implements UsuarioInterface {
    @ApiProperty({
        description: 'nome do usuáio',
        example: '',
    })
    @IsNotEmpty({
        message: 'o nome do usuáio deve ser informado',
    })
    @IsString()
    nome: string;

    @ApiProperty({
        description: 'email do usuáio',
        example: '',
    })
    @IsNotEmpty({
        message: 'o email do usuáio deve ser informado',
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'n° whatsapp do usuáio',
        example: '',
    })
    @IsNotEmpty({
        message: 'o n° whatsapp do usuáio deve ser informado',
    })
    @IsString()
    whatsapp: string;

    @ApiProperty({
        description: 'senha do usuáio',
        example: '',
    })
    @IsNotEmpty({
        message: 'a senha do usuáio deve ser informada',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'confirmação da senha do usuáio',
        example: '',
    })
    @IsNotEmpty({
        message: 'a confirmação da senha do usuáio deve ser informada',
    })
    @IsString()
    @MatchPassword(UsuarioCreateDto, (u) => u.password, { message: 'senha e confirme sua senha não correspondente' })
    confirmPassword: string;
}