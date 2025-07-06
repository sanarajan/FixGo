import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { HashService } from "../../../services/HashService";

@injectable()
export class ProviderResetPasswordUsecase {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
    @inject("HashService") private hashService: HashService
  ) {}
  async execute(currentPassword:string,password: string,id:string) {
        console.log("-hgfhfgh-")

    if (!password ) {
      throw new Error("Password and user ID are required");
    } 

     const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(currentPassword+"--")
        console.log(user+"-users-")

      const isMatch = await this.hashService.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
    const hashedPassword = await this.hashService.hash(password);
    const updated = await this.userRepo.updatePasswordById(
      id.toString(),
      hashedPassword
    );
   
    return updated;
  }
}
