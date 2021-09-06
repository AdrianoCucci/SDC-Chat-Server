import cors from "cors";
import express, { Application, json } from "express";
import { config as dotEnvConfig } from "dotenv";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { InMemoryDbContext } from "./database/in-memory-db-context";
import { IDbContext } from "./database/interfaces/db-context";
import { ApiService } from "./services/api-service";
import { MapperService } from "./services/mapper-service";
import { SocketService } from "./services/socket-service";

dotEnvConfig();

const corsOptions = {
  origin: "http://localhost:4200",
  allowedHeaders: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

const expressApp: Application = express();
expressApp.use(json());
expressApp.use(cors({ origin: corsOptions.origin }));

const httpServer: HttpServer = createServer(expressApp);
const socketServer = new SocketServer(httpServer, { cors: corsOptions });

const dbContext: IDbContext = new InMemoryDbContext();
const mapper = new MapperService();

new SocketService(socketServer);
new ApiService(expressApp, dbContext, mapper);

const port: string | number = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server running on port: ${port}`));