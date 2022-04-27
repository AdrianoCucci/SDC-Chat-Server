import { CronExpression } from "@nestjs/schedule";
import { readFileSync } from "fs";
import { Environment } from "src/models/environment.model";

export const defaultEnvironment = (): Environment => <Environment>{
  production: false,
  httpPort: 3000,
  baseHref: "",
  socketPath: "/socket",
  paginationMaxTakeCount: 100,
  cors: {
    origin: "*",
    credentials: true,
    allowedHeaders: [
      "Authorization",
      "Accept",
      "Cache-Control",
      "Content-Type",
      "Origin",
      "User-Agent"
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ]
  },
  chatMessageDeleteTask: {
    enabled: true,
    schedule: CronExpression.EVERY_WEEK,
    maxMessageHours: 24 * 7
  }
};

export const loadEnvironment = (path?: string): Environment => {
  let environment: Environment;
  path = path ?? ".environment/environment.json";

  try {
    const data: string = readFileSync(path, { encoding: "utf-8" });
    const customEnvironment: Environment = JSON.parse(data);

    environment = { ...defaultEnvironment(), ...customEnvironment };
  }
  catch(error) {
    throw {
      message: "Failed to load environment variables",
      error
    };
  }

  return environment;
}