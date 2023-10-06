import { Body, Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPublicEndpoint } from './decorators/api-public-endpoint.decorator';
import { ForgottenPasswordDto } from './dtos/forgotten-password.dto';

@Controller('v1/auth')
@ApiTags('v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiPublicEndpoint()
    @Post('forgotten-password')
    @ApiOperation({
        summary: 'senha esquecida',
        description: 'senha esquecida'
    })
    async forgottenPassword(@Body() dto: ForgottenPasswordDto) {
        return await this.authService.forgottenPassword(dto);
    }

    @ApiPublicEndpoint()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return await this.authService.login(req);
    }

    @Post('refresh-token')
    async refreshToken(@Query('token') token: string) {
        return this.authService.refreshToken(token);
    }
}
