import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";
import { readFileSync } from 'fs';
import { loadEnvironment } from "./utils/environment-utils";
import { Environment } from "./models/environment.model";

const env: Environment = loadEnvironment();
let httpOptions: HttpsOptions | undefined;

if(env.tls?.enabled) {
  httpOptions = {
    cert: readFileSync(env.tls.certPath),
    key: readFileSync(env.tls.keyPath)
  };
}

export default {
  ...env,
  httpOptions: <HttpsOptions | undefined>httpOptions,
  typeOrm: <TypeOrmModuleOptions>{
    type: env.database.type,
    host: env.database.server,
    port: env.database.port,
    database: env.database.name,
    username: env.database.username,
    password: env.database.password,
    entities: ["dist/**/*.entity{.ts,.js}"],
    options: { trustServerCertificate: true },
    synchronize: env.database.synchronize && !env.production
  }
};