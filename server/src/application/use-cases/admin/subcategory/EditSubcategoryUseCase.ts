
import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IServiceSubcategories,tokenUserData} from "../../../../domain/models/IServiceSubcategories"
@injectable()
export class EditSubcategoryUseCase {
  constructor(
    @inject("IServiceRepository") private repo: IServiceRepository,
  ) {}

  async execute(admin: tokenUserData, id: string, data: Partial<IServiceSubcategories>): Promise<IServiceSubcategories> {
    // optional: verify admin role
    const current = await this.repo.subcategoryFindById(id);
    if (!current) {
      const err = new Error("Subcategory not exist") as any;
      err.status = 404;
      throw err;
    }
    const subcategory = data.subcategory?.toLocaleUpperCase()

    if (data.subcategory && data.serviceId) {
        const nameTaken = await this.repo.isExistServicesubCategory(data.subcategory,data.serviceId, id);
        if (nameTaken) {

          const err = new Error("Subcategory  already exist") as any;
          err.status = 400;
          throw err;
        }
      }
    const updated = await this.repo.editSubcategory(id, {
      serviceId: data.serviceId ,
      subcategory:subcategory,
      status: data.status,
      updatedBy: admin.id,
    });

    return updated;
  }
}
