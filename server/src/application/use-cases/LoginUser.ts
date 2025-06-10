
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/models/User";
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthService } from "../services/AuthService";
import { HashService } from "../services/HashService";

@injectable()
export class LoginUser {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("HashService") private hashService: HashService,
    @inject("AuthService") private authService: AuthService
  ) {}

  async execute(
    email: string,
    password: string,
    userType:string
  ): Promise<{ tokens: { accessToken: string; refreshToken: string }; user: Partial<User> }> {       

    const user = await this.userRepository.findByEmail(email);
    if (!user) { 
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }          
    
    if (userType === "provider") {
      if (user.role !== "worker" && user.role !== "provider") {
        const error = new Error("Invalid user type");
        (error as any).status = 403;
        throw error;
      }
    } else {           

      if (user.role !== userType) { 
        const error = new Error("Invalid user type");
        (error as any).status = 403;
        throw error;
      }
    }
    
    const isMatch = await this.hashService.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      (error as any).status = 401;
      throw error;
    }

    const tokens = this.authService.generateTokens(user);
    const { password: _,_id, ...userInfo } = user;

    return { tokens, user: userInfo };
  }
}
