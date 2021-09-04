import cors from "cors";
import express, { Application, json } from "express";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { InMemoryDbContext } from "./database/in-memory-db-context";
import { IDbContext } from "./database/interfaces/db-context";
import { ApiService } from "./services/api-service";
import { SocketService } from "./services/socket-service";

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

new SocketService(socketServer, dbContext);
new ApiService(expressApp, dbContext);

const port: string | number = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server running on port: ${port}`));