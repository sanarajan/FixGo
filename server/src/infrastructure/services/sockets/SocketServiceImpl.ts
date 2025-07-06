import { ISocketService } from "../../../domain/services/sockets/ISocketService";
import { injectable } from "tsyringe";
import { Server } from "socket.io";

@injectable()
export class SocketServiceImpl implements ISocketService {
  private io: Server | null = null;

  public setSocketServer(io: Server) {
    this.io = io;
  }

  emitToUser(userId: string, event: string, data: any): void {
    if (!this.io) return;
    this.io.to(userId).emit(event, data);  // emit to specific user room
  }
}
