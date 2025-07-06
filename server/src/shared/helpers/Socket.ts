import { Server, Socket } from "socket.io";
import http from "http";
import { SocketServiceImpl } from "../../infrastructure/services/sockets/SocketServiceImpl";

export let io: Server;

export const setupSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // for dev; restrict in prod
      methods: ["GET", "POST", "OPTIONS"],
    },
  });

  const socketService = new SocketServiceImpl();
  socketService.setSocketServer(io);

  io.on("connection", (socket: Socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("register", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return socketService;
};
