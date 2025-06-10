import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { User } from "../../../../domain/models/User";
import { UserModel } from "../../../../infrastructure/database/models/UserModel";

@injectable()
@injectable()
export class SaveProfileUsecase {
  constructor(
    @inject("UserRepository") private repo: UserRepository,
  ) {}

  async execute(id: string,image:string): Promise<string|boolean|null> {
    const current = await this.repo.findProviderById(id);
    console.log(id+"provider exist")
    if (!current) {
      const err = new Error("Provider not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.providerProfileEdit(id,image);
    return updated;
  }
}
