import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { GoogleAuthService } from "../../domain/services/GoogleAuthService";
import jwt from "jsonwebtoken";
import { AuthService } from "../../application/services/AuthService";

@injectable()
export class GoogleLoginUseCase {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("GoogleAuthService") private googleAuthService: GoogleAuthService,
    @inject("AuthService") private authService: AuthService
  ) {}

  async execute(
    token: string,
    userType: "admin" | "customer" | "provider" | "worker" | "staff"
  ) {
    const payload = await this.googleAuthService.verifyToken(token);
    const { email, name, picture } = payload;
    let user = await this.userRepo.findByEmail(email);

    if (!user) {

      user = await this.userRepo.create({
        fullname: name,
        email,
        username: name,
        phone: "",
        password: "",
        role: userType,
        status: 'Active',
        image: picture,
        authProvider: "google",
        createdAt: new Date(),
      });
    }
    let googleUserTypeCheck = await this.userRepo.googleUserTypeCheck(
      email,
      userType
    );
    if (!googleUserTypeCheck.isValid) {
      console.log("here not need to come")
      const error: any = new Error(`User is not registered as a ${userType}`);
      error.status = 403;
      throw error;
    }
    const tokens = this.authService.generateTokens(user);
    const { password: _, ...userInfo } = user;

    return { tokens, user: userInfo };
  }
}
