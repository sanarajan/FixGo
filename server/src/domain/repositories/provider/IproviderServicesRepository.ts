import { IproviderServices } from "../../models/IproviderServices";
import { Types } from "mongoose";
import {GroupedProviderService} from "../../models/GroupProviderServices"
export interface IproviderServicesRepository {
  providerServices(page?: number, limit?: number,adminId?:string): Promise<IproviderServices[]|null>;    
  isExistProviderService(serviceId:string|Types.ObjectId,subcategory: string|Types.ObjectId,providerId: string|Types.ObjectId,id?:string): Promise<boolean|null>;   
  addProviderService(data: Partial<IproviderServices>): Promise<IproviderServices>;  
  providerServiceFindById(id: string): Promise<IproviderServices | null>;  
  editProviderService(id: string, data: Partial<IproviderServices>): Promise<IproviderServices>;  
  findAndDeleteProviderService(id: string): Promise<IproviderServices | null>;
  changeProServiceStatusById(id: string,status:string,admin:string): Promise<boolean | null>;
  GroupProviderServices(adminId:string): Promise<GroupedProviderService[] | null>;   
  addMultipleStaffServices(data: Partial<IproviderServices>[]): Promise<IproviderServices[]>;
removeStaffService(staffId: string, serviceId: string, subcategoryId: string): Promise<void>;
 

}