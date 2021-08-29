import express, { Application } from "express";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";

const expressApp: Application = express();
const httpServer: HttpServer = createServer(expressApp);
const socketServer: SocketServer = new SocketServer(httpServer);

socketServer.on("connection", () => console.log("New web socket connection..."));

const port: string | number = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server running on port: ${port}`));