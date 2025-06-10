
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/models/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { OtpService } from "../services/OtpService";
import { EmailService } from "../services/EmailService";

import nodemailer from "nodemailer";

@injectable()
export class EmailVerifications {

  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("OtpService") private otpService: OtpService,
    @inject("EmailService") private emailService: EmailService
  ) {}

  public async execute(email: string,userType:string): Promise<String> {
    const isExistEmail = await this.userRepository.emailVerification(email,userType);
    if (!isExistEmail) {
      const error = new Error("Invalid User");
      (error as any).status = 400;
      throw error;
    }
    const otp = await this.otpService.generateAndSaveOtp(email);
    await this.emailService.sendOtpEmail(email, otp); 
      console.log(`OTP for ${email}: ${otp}`);
    return otp;
  }
}
