import { inject, injectable } from "tsyringe";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { User } from "../../../../domain/models/User";

@injectable()
export class ShowProviderProfileUsecase {

  constructor(
    @inject("UserRepository")
    private Repo: UserRepository
  ) {}

  async execute(id:string): Promise<User|null> {   

   return this.Repo.showProvider(id);
  }
}
