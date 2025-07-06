import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { NotificationService } from "../../../../application/services/NotificationService";
import {EmailService} from "../../../services/EmailService"
@injectable()
export class RejectStaffUseCase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("NotificationService") private notificationService: NotificationService,
    @inject("EmailService") private emailrepo: EmailService

    
  ) {}

  public async execute(staffId: string, reason: string): Promise<boolean> {
    const staff = await this.userRepository.findById(staffId);
    if (!staff) throw new Error("Staff not found");

    await this.userRepository.updateStaffRejection(staffId, reason);

    await this.notificationService.sendRejectionNotice(staff._id as string, reason);
  await this.emailrepo.rejectVerify(staff.fullname as string,staff.email,reason)
    return true;
  }
}
