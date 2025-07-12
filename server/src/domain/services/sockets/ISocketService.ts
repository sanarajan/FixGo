import { Server } from "socket.io";

export interface ISocketService {
  emitToUser(userId: string, event: string, data: any): string;
  setSocketServer(io: Server): void; // ✅ Only this
  
}
