import express, { Application } from "express";
import { Server as HttpServer, createServer } from "http";
import { Server as SocketServer, ServerOptions, Socket } from "socket.io";

const expressApp: Application = express();
const httpServer: HttpServer = createServer(expressApp);

const socketServerOptions: Partial<ServerOptions> = {
  cors: {
    origin: "http://localhost:4200",
    allowedHeaders: ["GET", "POST"]
  }
}

const socketServer = new SocketServer(httpServer, socketServerOptions);

socketServer.on("connection", (socket: Socket) => {
  console.log("New web socket connection...");

  socket.on("disconnect", (reason: string) => {
    console.log("Socket disconnected...\nReason: ", reason);
  });
});


const port: string | number = process.env.PORT || 3000;
httpServer.listen(port, () => console.log(`Server running on port: ${port}`));