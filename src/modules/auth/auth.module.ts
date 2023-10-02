import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule,
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
})
export class AuthModule { }
