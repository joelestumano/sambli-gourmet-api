import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const contexto = host.switchToHttp();
        const response = contexto.getResponse();
        const request = contexto.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof HttpException ? exception.getResponse() : exception;

        this.logger.error(`Http status: ${status} Error Message: ${JSON.stringify(message)}`);

        return response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message
        })
    }
}