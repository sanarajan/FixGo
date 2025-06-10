
import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { EmailService } from "../services/EmailService";
import { AuthService } from "../services/AuthService";
import  { ObjectId } from "mongoose";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("EmailService") private emailService: EmailService,
    @inject("AuthService") private authService: AuthService

  ){}
  async execute(
    email: string,
    userType: "admin" | "customer" | "provider" | "worker" | "staff"
  ) {
    
    let googleUserTypeCheck = await this.userRepo.googleUserTypeCheck(
      email,
      userType
    );
    if (!googleUserTypeCheck.isValid) {
      const error: any = new Error(`Email is not registered as a ${userType}`);
      error.status = 403;
      throw error;
    }
    const token = this.authService.generateForgotToken();
    const expires = new Date(Date.now() + 3600000);
    console.log(googleUserTypeCheck._id+" id check")
    if (googleUserTypeCheck._id) {
      await this.userRepo.setForgotPasswordLink(googleUserTypeCheck._id, token, expires);
    } else {
      throw new Error("User ID not found for Google user.");
    }

    const userid= googleUserTypeCheck._id
    let userPrefix = userType !== "customer" ? userType + "/" : "";


    const link = `${process.env.FRONTEND_URL}${userPrefix}resetPassword/${token}`;
    const result = await this.emailService.sendForgotEmail(email, link); 
    

    return result;
  }
}