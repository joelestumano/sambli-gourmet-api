import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';

@Injectable()
export class SetCodigoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    let body: PedidoCreateDto = request.body;
    body.codigo = this.fakeProtocol();

    return next.handle();
  }

  private fakeProtocol(): string {
    const tDay = new Date();
    const date = `${this.fill(tDay.getDate(), 2)}${this.fill(
      tDay.getMonth() + 1,
      2,
    )}${this.fill(tDay.getFullYear(), 4).slice(2)}`;
    const time = `${this.fill(tDay.getHours(), 2)}${this.fill(
      tDay.getMinutes(),
      2,
    )}${this.fill(tDay.getMilliseconds(), 3)}`;
    return date.concat(time);
  }

  private fill(value: number, length: number): string {
    let str = value.toString();
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
}
