import { Server, Socket } from "socket.io";
import { injectable } from "tsyringe";
import { ISocketService } from "../../../domain/services/sockets/ISocketService";

@injectable()
export class SocketServiceImpl implements ISocketService {
  private io: Server | null = null;

  setSocketServer(server: Server): void {
    this.io = server;

    this.io.on("connection", (socket: Socket) => {
      console.log("🔌 New socket connected:", socket.id);

      socket.on("registerUser", (userId: string) => {
        console.log("✅ User joined room:", userId);
        socket.join(userId); // Join room by userId
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  }

  emitToUser(userId: string, event: string, payload: any): string {
    if (!this.io) return `❌ Socket server not initialized`;

    this.io.to(userId).emit(event, payload);
    return `✅ Emitted '${event}' to userId (room): ${userId}`;
  }
}
