import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MessengerService } from '../messenger/messenger.service';
import { ForgotPasswordListener } from './listeners/forgot-password.listener';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule,
        UsuarioModule,
        WhatsappModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwtconfig.jwt_secret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwtconfig.jwt_expiration_time'),
                },
            }),
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, MessengerService, ForgotPasswordListener],
    exports: [JwtModule, AuthService]
})
export class AuthModule { }
