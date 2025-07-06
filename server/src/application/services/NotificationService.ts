import { inject, injectable } from "tsyringe";
import { ISocketService } from "../../domain/services/sockets/ISocketService";

@injectable()
export class NotificationService {
  constructor(
    @inject("SocketService") private socketService: ISocketService
  ) {}

  async sendRejectionNotice(providerId: string, reason: string): Promise<void> {
    this.socketService.emitToUser(providerId, "staff_rejected", {
      title: "Staff Rejected",
      reason,
    });
  }
}
