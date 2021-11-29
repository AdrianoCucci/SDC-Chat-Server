import { config } from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

config();
const env: NodeJS.ProcessEnv = process.env;

export default {
  httpPort: Number(env.HTTP_PORT),
  jwtSecret: env.JWT_SECRET,
  typeOrm: <TypeOrmModuleOptions>{
    type: "postgres",
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
  }
};