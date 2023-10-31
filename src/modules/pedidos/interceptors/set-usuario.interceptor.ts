import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { TokenDecodeType } from 'src/modules/auth/entities/token-decode.type';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';

@Injectable()
export class SetUsuarioInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SetUsuarioInterceptor.name);
  constructor(private authService: AuthService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('token de autorização ausente');
    }

    const [_, token] = authorization.split(' ');

    await this.authService.tokenVerifyAsync(token).then((tokenDecode: TokenDecodeType) => {

      let body: PedidoCreateDto = request.body;
      body.usuario = tokenDecode.sub;

    }).catch((error) => {
      this.logger.error(error);
      throw new UnauthorizedException('token inválido');
    });

    return next.handle();
  }
}
