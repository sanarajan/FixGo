import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
@injectable()
export class BlockUnblockServiceUsecase {
  constructor(
    @inject("IServiceRepository") private repo: IServiceRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.repo.serviceFindById(id);
    if (!current) {
      const err = new Error("Service not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.changeStatusById(id,status,admin);
    return updated?true:false;
  }
}
