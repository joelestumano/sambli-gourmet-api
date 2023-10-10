import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TkInterface } from './entities/token.interface';
import { UsuarioService } from '../usuario/usuario.service';
import { ForgottenPasswordDto } from './dtos/forgotten-password.dto';
import { MessengerService } from '../messenger/messenger.service';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private messengerService: MessengerService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = (await this.usuarioService.findUserByEmail(email)) as any;
        if (user && (await bcrypt.compareSync(pass, user.password))) {
            return {
                _id: user._id,
                nome: user.nome,
                email: user.email,
            };
        }
        return null;
    }

    async login(req: any) {
        const payload: TkInterface = {
            sub: req.user._id,
            nome: req.user.nome,
            email: req.user.email,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async refreshToken(token: string) {
        try {
            const tokenDecode = (await this.jwtService.verifyAsync(
                token,
            )) as TkInterface;
            const payload = {
                sub: tokenDecode.sub,
                nome: tokenDecode.nome,
                email: tokenDecode.email,
            };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw new UnauthorizedException('token inválido');
        }
    }

    async forgottenPassword(dto: ForgottenPasswordDto): Promise<{ message: string }> {
        const usuario = await this.usuarioService.findUserByEmail(dto.email);
        const subject = 'Esqueceu sua senha'
        const content = `<h1>Olá ${usuario.nome}!</h1>
        <p>Infelizmente não podemos lhe ajudar no momento.</p>
        `
        return await this.messengerService.sendEmail(dto.email, subject, content).then(() => {
            return { message: content }
        }).catch(error => {
            throw new ServiceUnavailableException(error);
        })

    }
}
