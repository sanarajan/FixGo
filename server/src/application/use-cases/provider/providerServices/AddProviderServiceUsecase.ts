import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
import {IproviderServices} from "../../../../domain/models/IproviderServices"
import {tokenUserData} from "../../../../domain/models/Iservices"

@injectable()
export class AddProviderServiceUsecase { 
   constructor(
      @inject("IproviderServicesRepository")
      private providerServiceRepo: IproviderServicesRepository
    ) {}  


  public async execute(userAdmin:tokenUserData,data: IproviderServices): Promise<IproviderServices> {
     const serviceId = data.serviceId
     const subcategory =data.subcategoryId
     const adminId = userAdmin.id

     const isExistService = await this.providerServiceRepo.isExistProviderService(serviceId,subcategory,adminId);

     if (isExistService) {
       const error = new Error("Provider service already exists");
       (error as any).status = 400;
       throw error;
     }   
 

     const servicedata = {
         serviceId: data.serviceId,
         subcategoryId:subcategory,
         description:data.description,
         features:data.features,
         status: data.status,
         image:data.image,
         createdBy: userAdmin.id
       };

       const createdService = await this.providerServiceRepo.addProviderService(servicedata);

       if(!createdService){
         const error = new Error("Provider service not saved");
         (error as any).status = 400;
         throw error;
       }
     return createdService;
   }
 }