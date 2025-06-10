import { injectable, inject } from "tsyringe";
import { ICustomerRepository } from "../../../../domain/repositories/ICustomerRepository";
import {IproviderServices} from "../../../../domain/models/IproviderServices"
import {IServiceSubcategories} from "../../../../domain/models/IServiceSubcategories"
import { GroupedProviderService } from "../../../../domain/models/GroupProviderServices";

@injectable()
export class ProviderServicesInLocation { 
   constructor(
       @inject("CustomerRepository")
      private repo: ICustomerRepository  
    ) {}  


  async execute(mainServiceId:string,id?:string,coordinates?:{
    lat: number;
    lng: number;
  },providerId?:string): Promise<GroupedProviderService[]|null> {
    const services= this.repo.providerServiceInLocation(mainServiceId,id,coordinates,providerId);
    return services
  }
}
