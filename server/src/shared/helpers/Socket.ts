import { Server, Socket } from "socket.io";
import http from "http";
import { container } from "tsyringe";
import { ISocketService } from "../../domain/services/sockets/ISocketService";

export let io: Server;

export const setupSocket = (server: http.Server): Server => {
  console.log("🛠 Step 1: Creating socket server");
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  console.log("✅ Step 2: Socket.IO server created");

  const socketService = container.resolve<ISocketService>("SocketService");
  socketService.setSocketServer(io);

  console.log("✅ Step 3: SocketService initialized");

  return io;
};
