import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
@injectable()
export class DeleteSubcategoryUsecase {
  constructor(
    @inject("IServiceRepository") private repo: IServiceRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    // optional: verify admin role
    const current = await this.repo.subcategoryFindById(id);
    if (!current) {
      const err = new Error("Service not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.findAndDeleteSubcategory(id);
    return updated?true:false;
  }
}
