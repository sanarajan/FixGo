import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
@injectable()
export class BlockUnblockProviderUseCase {
  constructor(
    @inject("UserRepository") private userRepo: UserRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.userRepo.findProviderById(id);
    console.log(id+" user")
    if (!current) {
      const err = new Error("Provider not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.userRepo.changeStatusById(id,status,admin);
       return updated?true:false;
  }
}
