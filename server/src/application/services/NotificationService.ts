import { inject, injectable } from "tsyringe";
import { ISocketService } from "../../domain/services/sockets/ISocketService";
import { NotificationModel } from "../../infrastructure/database/models/NotificationModel ";
import {User} from "../../domain/models/User";

@injectable()
export class NotificationService {
  constructor(
    @inject("SocketService") private socketService: ISocketService
  ) {}

  async sendRejectionNotice(providerId: string, reason: string,data:User,adminId:string,staffId:string): Promise<void> {
    const title = "Staff Rejected";
    const message = `A staff has been rejected. Reason: ${reason}`;

    // Save notification
    await NotificationModel.create({
      userId: providerId,
      type: "staff_rejected",
      title,
      message,
      sendBy: adminId, 
      rejectedStaff:staffId
    });
    data.rejected =true
    // Emit socket notification to the userId room
    const emits = this.socketService.emitToUser(providerId, "staff_rejected", {
      title,
      reason,
      data
    });
    console.log(emits + "  from service");
  }
}
