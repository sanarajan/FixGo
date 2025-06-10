
import { inject, injectable } from "tsyringe";
import { User } from "../../domain/models/User";
import { UserRepository } from '../../domain/repositories/UserRepository';

@injectable()
export class FetchUserUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
  ) {}

  async execute(
    adminId:string
  ): Promise<{ user: Partial<User> }> {       

    const user = await this.userRepository.fetchUserById(adminId);
    if (!user) { 
      const error = new Error("User not found");
      (error as any).status = 404;
      throw error;
    }
    
    
    const { _id, ...userInfo } = user;

    return {  user: userInfo };
  }
}
