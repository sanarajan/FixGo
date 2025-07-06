export interface ISocketService {
  emitToUser(userId: string, event: string, data: any): void;
}
