import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TkInterface } from './entities/token.interface';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usuarioService.findUserByEmail(email) as any;
        if (user && bcrypt.compareSync(pass, user.password)) {
            return {
                _id: user._id,
                nome: user.nome,
                email: user.email,
            };
        }
        return null;
    }

    async login(req: any) {


        console.log(req)

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
            const tokenDecode = (await this.jwtService.verifyAsync(token)) as TkInterface;
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
}