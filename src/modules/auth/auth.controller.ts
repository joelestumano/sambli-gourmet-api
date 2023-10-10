import { Body, Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPublicEndpoint } from './decorators/api-public-endpoint.decorator';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiPublicEndpoint()
    @Post('forgot-password')
    @ApiOperation({
        summary: 'esqueceu sua senha',
        description: 'esqueceu sua senha'
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
        return await this.authService.refreshToken(token);
    }

    @ApiPublicEndpoint()
    @ApiOperation({
        summary: 'redefinir senha',
        description: 'redefinir senha'
    })
    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return await this.authService.resetPassword(dto);
    }
}
