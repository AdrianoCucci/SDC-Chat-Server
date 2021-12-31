import { config } from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

config();
const env: NodeJS.ProcessEnv = process.env;

export default {
  production: false,
  
  httpPort: Number(env.HTTP_PORT),
  jwtSecret: env.JWT_SECRET,

  cors: <CorsOptions> {
    origin: "*",
    allowedHeaders: ["Accept", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  },
  
  typeOrm: <TypeOrmModuleOptions>{
    type: "postgres",
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    entities: ["dist/**/*.entity{.ts,.js}"]
  }
};