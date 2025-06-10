import { injectable, inject } from "tsyringe";
import { ICustomerRepository } from "../../../../domain/repositories/ICustomerRepository";
import {IService} from "../../../../domain/models/Iservices"
import {IServiceSubcategories} from "../../../../domain/models/IServiceSubcategories"

@injectable()
export class AdminServicesUsecase { 
   constructor(
      @inject("CustomerRepository")
      private repo: ICustomerRepository  
    ) {}  


  async execute(type:string,service?:string): Promise<IService[] | IServiceSubcategories[] | null> {
    let  services
    if(!service){
     services= await this.repo.adminServices(type);
    }else if (type === "subcatgory" && service) {
      return await this.repo.adminServices("subcatgory", service);
    } else {
      throw new Error("Invalid request type or missing service ID");
    }
    return services
  }
}
