import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IServiceSubcategories,tokenUserData} from "../../../../domain/models/IServiceSubcategories"

@injectable()
export class BlockUnblockSubcategoryUsecase {
  constructor(
    @inject("IServiceRepository") private repo: IServiceRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.repo.subcategoryFindById(id);
    if (!current) {
      const err = new Error("Service not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.changesubcategoryStatusById(id,status,admin);
    return updated?true:false;
  }
}
