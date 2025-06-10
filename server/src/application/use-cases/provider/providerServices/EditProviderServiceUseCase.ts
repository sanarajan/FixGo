
import { inject, injectable } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
import {IproviderServices} from "../../../../domain/models/IproviderServices"
import {tokenUserData} from "../../../../domain/models/Iservices"

@injectable()
export class EditProviderServiceUseCase {
   constructor(
       @inject("IproviderServicesRepository")
       private providerServiceRepo: IproviderServicesRepository
     ) {}  

  async execute(admin: tokenUserData, id: string, data: Partial<IproviderServices>): Promise<IproviderServices> {
    // optional: verify admin role
    console.log(data.serviceId+"  serviceid")
    const serviceId = data.serviceId
   const current = await this.providerServiceRepo.providerServiceFindById(id);

    if (!current) {
     const err = new Error("Provider Service not exist") as any;
     err.status = 404;
      throw err;
   }
    

    if (data.subcategoryId && data.serviceId) {
        const nameTaken = await this.providerServiceRepo.isExistProviderService(data.serviceId,data.subcategoryId, id);
        if (nameTaken) {

          const err = new Error("Subcategory  already exist") as any;
          err.status = 400;
          throw err;
        }
      }
      
    const updated = await this.providerServiceRepo.editProviderService(id, {
      serviceId: data.serviceId ,
      subcategoryId:data.subcategoryId,
      description:data.description,
      features:data.features,
      status: data.status,
      image:data.image,
      updatedBy: admin.id,
    });

    return updated;
  }
}
