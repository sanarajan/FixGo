import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
import {IproviderServices} from "../../../../domain/models/IproviderServices"
@injectable()
export class ProviderServiceUsecase { 
   constructor(
      @inject("IproviderServicesRepository")
      private providerServiceRepo: IproviderServicesRepository
    ) {}  


  async execute(page?: number, limit?: number,adminId?:string): Promise<IproviderServices[]|null> {
    const services= this.providerServiceRepo.providerServices(page, limit,adminId);
    return services
  }
}
