import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  key: `${process.env.OPENAI_API_KEY}`,
}));
