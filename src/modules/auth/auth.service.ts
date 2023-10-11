import { BadRequestException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TkInterface } from './entities/token.interface';
import { UsuarioService } from '../usuario/usuario.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { MessengerService } from '../messenger/messenger.service';
import { SecurityTokenI } from '../usuario/entities/usuario.entity';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
        private messengerService: MessengerService,
        private eventEmitter: EventEmitter2
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = (await this.usuarioService.findUserByEmail(email, 'password')) as any;
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

    async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
        const usuario = await this.usuarioService.findUserByEmail(dto.email);

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        const token = crypto.randomBytes(20).toString('hex');

        const securityToken: SecurityTokenI = {
            token: token,
            expiration: expiration.toISOString()
        }

        const update = await this.usuarioService.update(usuario['_id'], { securityToken: securityToken });

        const subject = 'Redefinição de senha'
        const content = `<h1>Olá ${usuario.nome}!</h1>
         <p>Recebemos uma solicitação para redefinir a sua senha. Para prosseguir com a redefinição, por favor siga as instruções abaixo:</p>

         <p>Acesse a página de redefinição de senha pelo app ou <a href="https://sg-painel.onrender.com/login">SG - Painel</a>.</p>
         <p>Preencha o formulário informado os dados solicitados.</p>
         <p>Utilize o token ${securityToken.token}.</p>
         <p>Certifique-se de ter inserido corretamente todas as informações solicitadas e prossiga com o envio.</p>

         <h4>Lembramos que o token de redefinição possui validade de uma hora a partir do recebimento deste e-mail. Caso o prazo expire, será necessário solicitar uma nova redefinição de senha.</h4>
         `
        return await this.messengerService.sendEmail(dto.email, subject, content).then(() => {
            this.eventEmitter.emit('forgot.password', usuario);
            return { message: content }
        }).catch(error => {
            throw new ServiceUnavailableException(error);
        })
    }

    async resetPassword(dto: ResetPasswordDto) {
        const usuario = await this.usuarioService.findUserByEmail(dto.email, 'securityToken');
        if (dto.token !== usuario.securityToken.token) {
            throw new BadRequestException(`token inválido`);
        }
        const moment = new Date();
        const expira = new Date(usuario.securityToken.expiration);
        if (moment > expira) {
            throw new BadRequestException(`token expirado`);
        }
        const newPassword = await bcrypt.hashSync(dto.password, 10)
        return await this.usuarioService.update(usuario['_id'], { password: newPassword });
    }
}
