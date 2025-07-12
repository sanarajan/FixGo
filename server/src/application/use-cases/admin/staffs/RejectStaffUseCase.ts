import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { NotificationService } from "../../../../application/services/NotificationService";
import { EmailService } from "../../../services/EmailService";
import {User} from "../../../../domain/models/User";

// 👇 Import these from wherever you keep your socket setup
// import { io, socketUserMap } from "../../../../shared/helpers/Socket"; // adjust path as needed

@injectable()
export class RejectStaffUseCase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("NotificationService") private notificationService: NotificationService,
    @inject("EmailService") private emailrepo: EmailService
  ) {}

  public async execute(staffId: string, reason: string,data:User,adminId:string): Promise<boolean> {
    const staff = await this.userRepository.findById(staffId);
    if (!staff) throw new Error("Staff not found");

    await this.userRepository.updateStaffRejection(staffId, reason);

    // 1. Send notification to provider (optional logic you already had)
    await this.notificationService.sendRejectionNotice(staff.providerId as string, reason,data,adminId,staffId);

    // 2. Email notification
    const provider = await this.userRepository.findById(staff.providerId as string);
    if (!provider) throw new Error("Provider not found");

    const providerEmail = provider.email;
    await this.emailrepo.rejectVerify(staff.fullname as string, providerEmail, reason);

    // 3. 💬 Real-time socket message to provider
    // const targetSocketId = socketUserMap.get(staff.providerId as string);
    // if (targetSocketId) {
    //   io.to(targetSocketId).emit("staffRejected", {
    //     message: `${staff.fullname} was rejected.`,
    //     reason,
    //   });
    // } else {
    //   console.log(`No connected socket for user: ${staff.providerId}`);
    // }
    
    return true;
  }
}
