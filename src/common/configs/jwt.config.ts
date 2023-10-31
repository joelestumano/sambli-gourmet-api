import { registerAs } from '@nestjs/config';

export default registerAs('jwtconfig', () => ({
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration_time: `${process.env.JWT_EXPIRATION_TIME}`,
}));
