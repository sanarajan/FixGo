import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../../domain/repositories/UserRepository";
import { User } from "../../../../../domain/models/User";
import { UserModel } from "../../../../../infrastructure/database/models/UserModel";

@injectable()
@injectable()
export class BlockStaffUsecase {
  constructor(
    @inject("UserRepository") private repo: UserRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.repo.findStaffWithIdAndType(id);
    if (!current) {
      const err = new Error("Staff not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.changeStaffStatusByIdAndType(id,status,admin);
    return updated?true:false;
  }
}
