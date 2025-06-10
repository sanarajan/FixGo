import { injectable, inject } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IServiceSubcategories} from "../../../../domain/models/IServiceSubcategories"
@injectable()
export class ServicesSubcategoriesUseCase { 
   constructor(
      @inject("IServiceRepository")
      private serviceRepo: IServiceRepository
    ) {}  

  async execute(page?: number, limit?: number): Promise<IServiceSubcategories[]> {
    return this.serviceRepo.serviceSubcategories(page, limit);
  }
}
