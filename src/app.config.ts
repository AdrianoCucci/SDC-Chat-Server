import { config } from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { CronExpression } from "@nestjs/schedule";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";
import { readFileSync } from 'fs';

config();
const env: NodeJS.ProcessEnv = process.env;

const production: boolean = Boolean(env.PRODUCTIOn);
export default {
  production: production,

  baseHref: "",
  httpPort: Number(env.HTTP_PORT),
  jwtSecret: env.JWT_SECRET,
  socketPath: "/socket",
  paginationMaxTakeCount: 100,

  cors: <CorsOptions>{
    origin: "*",
    credentials: true,
    allowedHeaders: ["Authorization", "Accept", "Cache-Control", "Content-Type", "Origin", "User-Agent"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  },

  httpOptions: <HttpsOptions>{
    cert: env.TLS_CRT_PATH ? readFileSync(env.TLS_CRT_PATH) : undefined,
    key: env.TLS_KEY_PATH ? readFileSync(env.TLS_KEY_PATH) : undefined
  },

  typeOrm: <TypeOrmModuleOptions>{
    type: "mssql",
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    entities: ["dist/**/*.entity{.ts,.js}"],
    options: { trustServerCertificate: true },
    synchronize: !production
  },

  startup: {
    rootUser: {
      username: env.ROOT_USERNAME,
      password: env.ROOT_PASSWORD
    }
  },

  chatMessageDeleteTask: {
    enabled: true,
    schedule: CronExpression.EVERY_WEEK,
    maxMessageHours: 24 * 7
  }
};