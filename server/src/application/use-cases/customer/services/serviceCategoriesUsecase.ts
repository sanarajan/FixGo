import { injectable, inject } from "tsyringe";
import { ICustomerRepository } from "../../../../domain/repositories/ICustomerRepository";
import {IServiceSubcategories} from "../../../../domain/models/IServiceSubcategories"

@injectable()
export class serviceCategoriesUsecase { 
   constructor(
       @inject("CustomerRepository")
      private repo: ICustomerRepository  
    ) {}  


  async execute(serviceId?:string): Promise<IServiceSubcategories[]|null> {
if (!serviceId) throw new Error("Missing serviceId");
    const services= this.repo.serviceCategories(serviceId);
    return services
    
  }
}
