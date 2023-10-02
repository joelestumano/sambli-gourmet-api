import { Controller, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/auth')
@ApiTags('v1/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

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
