import { Body, Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPublicEndpoint } from './decorators/api-public-endpoint.decorator';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('v1/auth')
@ApiTags('v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiPublicEndpoint()
    @Post('forgot-password')
    @ApiOperation({
        summary: 'senha esquecida',
        description: 'senha esquecida'
    })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(dto);
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
