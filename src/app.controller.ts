import { Controller, Get, Redirect, } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { ApiPublicEndpoint } from './modules/auth/decorators/api-public-endpoint.decorator';

@Controller()
@ApiExcludeController()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @ApiPublicEndpoint()
    @Get()
    @Redirect('/docs')
    redirect() { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
