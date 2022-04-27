import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export interface Environment {
  production: boolean;
  httpPort: number;
  baseHref: string;
  socketPath: string;
  jwtSecret: string;
  paginationMaxTakeCount: number;
  cors?: CorsOptions;
  database: {
    type: string;
    server: string;
    port: number;
    name: string;
    username: string;
    password: string;
    synchronize?: boolean;
    rootUser: {
      username: string;
      password: string;
    }
  };
  tls?: {
    enabled: boolean;
    certPath: string;
    keyPath: string;
  };
  chatMessageDeleteTask: {
    enabled: boolean;
    schedule: string;
    maxMessageHours: number;
  }
}