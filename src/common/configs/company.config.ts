import { registerAs } from '@nestjs/config';

export default registerAs('company', () => ({
    business: `${process.env.COMPANY_BUSINESS}`,
    name: `${process.env.COMPANY_NAME}`,
}));