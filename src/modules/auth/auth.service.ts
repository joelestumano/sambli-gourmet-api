import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TkInterface } from './entities/token.interface';
import { UsuarioService } from '../usuario/usuario.service';
import { ForgottenPasswordDto } from './dtos/forgotten-password.dto';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private emailService: EmailService,
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
        return await this.emailService
            .sendMail(usuario)
            .then((resp: any) => {
                let response: { message: string };
                return response = {
                    ...response,
                    message: `Uma mensagem com instruções para recuperação de senha foi enviado para o seu endereço de e-mail ${dto.email}. Por favor, verifique sua caixa de entrada e/ou pasta de spam para encontrar o e-mail. Ele deve chegar em alguns minutos.`,
                };
            })
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });

    }
}
