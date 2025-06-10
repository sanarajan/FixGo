import { IService } from "../models/Iservices";
import { Types } from "mongoose";
import {IServiceSubcategories} from "../models/IServiceSubcategories"

export interface IServiceRepository {
  listServices(page?: number, limit?: number): Promise<IService[]>;
  addService(data: Partial<IService>): Promise<IService>;
  isExistService(serviceName: string,id?:string): Promise<boolean|null>;  
  editService(id: string, data: Partial<IService>): Promise<IService>;
  serviceFindById(id: string): Promise<IService | null>;
  findAndDeleteService(id: string): Promise<IService | null>;
  changeStatusById(id: string,status:string,admin:string): Promise<boolean | null>;
  
  serviceSubcategories(page?: number, limit?: number): Promise<IServiceSubcategories[]>;
  isExistServicesubCategory(subcategoryName: string,serviceId:string|Types.ObjectId,id?:string): Promise<boolean|null>;   
  addSubcategory(data: Partial<IServiceSubcategories>): Promise<IServiceSubcategories>;
  subcategoryFindById(id: string): Promise<IServiceSubcategories | null>;
  editSubcategory(id: string, data: Partial<IServiceSubcategories>): Promise<IServiceSubcategories>;
  changesubcategoryStatusById(id: string,status:string,admin:string): Promise<boolean | null>;
  findAndDeleteSubcategory(id: string): Promise<IServiceSubcategories | null>;
  
  
}