import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { HashService } from "../../../services/HashService";

@injectable()
export class ProviderResetPasswordUsecase {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("HashService") private hashService: HashService
  ) {}
  async execute(password: string,id:string) {
    if (!password ) {
      throw new Error("Password and user ID are required");
    } 
 console.log(id+"  id und")
    const hashedPassword = await this.hashService.hash(password);
    const updated = await this.userRepo.updatePasswordById(
      id.toString(),
      hashedPassword
    );
   
    return updated;
  }
}
