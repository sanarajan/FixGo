
import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IServiceSubcategories,tokenUserData} from "../../../../domain/models/IServiceSubcategories"

@injectable()
export class addServiceSubcategoryuseCase {
  constructor(
    @inject("IServiceRepository") private IserviceRepo: IServiceRepository,
  ) {}

  public async execute(userAdmin:tokenUserData,data: IServiceSubcategories): Promise<IServiceSubcategories> {
    const subcategory = data.subcategory.toLocaleUpperCase()
    const isExistService = await this.IserviceRepo.isExistServicesubCategory(subcategory,data.serviceId);

    if (isExistService) {
      const error = new Error("Subcategory already exists");
      (error as any).status = 400;
      throw error;
    }   

   
    const servicedata = {
        serviceId: data.serviceId,
        subcategory: subcategory,
        status: data.status,
        createdBy: userAdmin.id
      };

      const createdService = await this.IserviceRepo.addSubcategory(servicedata);

      if(!createdService){
        const error = new Error("Subcategory not saved");
        (error as any).status = 400;
        throw error;
      }
    return createdService;
  }
}
