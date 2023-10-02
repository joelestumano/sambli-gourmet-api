import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    handleRequest(err: any, user: any, info: Error, context: any) {
        if (user) {
            return user;
        }
        const allowAny = this.reflector.get<boolean>('allow-any', context.getHandler());
        if (allowAny) {
            return true;
        }
        throw new UnauthorizedException('não autorizado');
    }
}