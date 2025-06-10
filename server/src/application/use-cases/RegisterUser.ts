
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/models/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { HashService } from "../services/HashService";

@injectable()
export class RegisterUser {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("HashService") private hashService: HashService
  ) {}

  public async execute(user: User): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(user.email);
    if (existingEmail) {
      const error = new Error("Email already exists");
      (error as any).status = 400;
      throw error;
    }

    const existingUsername = await this.userRepository.findByUsername?.(user.username);
    if (existingUsername) {
      const error = new Error("Username already exists");
      (error as any).status = 400;
      throw error;
    }

    const existingPhone = await this.userRepository.findByPhone?.(user.phone);
    if (existingPhone) {
      const error = new Error("Phone number already exists");
      (error as any).status = 400;
      throw error;
    }

    //  Hash password using injected HashService
    const hashedPassword = await this.hashService.hash(user.password);
    user.password = hashedPassword;

    //  Create user
    const createdUser = await this.userRepository.create(user);
    return createdUser;
  }
}
