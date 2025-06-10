import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { HashService } from "../services/HashService";

@injectable()
export class ResetPassword {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("HashService") private hashService: HashService
  ) {}
  async execute(password: string, token: string) {
    if (!password || !token) {
      throw new Error("Password and user ID are required");
    }
    const forgotClick = await this.userRepo.findForgotClickByToken(token);

    if (!forgotClick) {
      throw new Error("Invalid or expired reset token");
    }

    // ✅ 2. Check if the token is expired
    if (forgotClick.expiresAt < new Date()) {
      throw new Error("Reset token has expired");
    }
    if (forgotClick.clicked === true) {
      throw new Error("Already reset password");
    }
    const hashedPassword = await this.hashService.hash(password);
    const updated = await this.userRepo.updatePasswordById(
      forgotClick.userId.toString(),
      hashedPassword
    );
    const updateClickStatus = await this.userRepo.updateClickedTrue(
      forgotClick.userId.toString()
    );

    if (!updateClickStatus) {
      throw new Error("Failed to update password");
    }

    return updated;
  }
}
