import { registerAs } from "@nestjs/config";

export default registerAs('dbconfig', () => ({

    host: `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.bhpuqyv.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`

}))