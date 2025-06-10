// data/repositories/ServiceRepositoryImpl.ts
import { injectable } from "tsyringe";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
// import { IService } from "../../../domain/models/Iservices";
import { ServiceModel,IService } from "../models/ServiceModel";
import {tokenUserData} from "../../../domain/models/Iservices"
import {IServiceSubcategories} from "../../../domain/models/IServiceSubcategories"
import {SubcategoryModel} from "../models/SubcategoryModel"
export type CreateServiceInput = Pick<IService, 'serviceName' | 'status' | 'createdBy'>;
// export type CreateSubcategoryInput = Pick<IServiceSubcategories, 'serviceId'|'subcategoryNam' | 'status' | 'createdBy'>;

@injectable()
export class ServiceRepositoryImpl implements IServiceRepository {
  
  async listServices(page: number = 1, limit: number = 3): Promise<IService[]> {
    const skip = (page - 1) * limit;
    const services =  await ServiceModel.find() .skip(skip)
     .sort({ createdAt: -1 })
    .limit(limit).lean();    
    return services;
  }
  async addService(data: CreateServiceInput): Promise<IService> {
    const createService = await ServiceModel.create(data);
    const { _id, ...rest } = createService.toObject();
    return createService;
  }
  
  async isExistService(serviceName: string,id:string): Promise<boolean | null> {
    serviceName=serviceName.toLocaleUpperCase()
      const filter: any = { serviceName };
      // when an id is supplied, exclude that document
      if (id) filter._id = { $ne: id };
      const doc = await ServiceModel.findOne(filter).lean();
      return !!doc;     
  }

  async editService(id: string, data: Partial<IService>): Promise<IService> {
    const updated = await ServiceModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("Failed to update service");
    }
    return updated;
  }
  async serviceFindById(id: string): Promise<IService | null> {
    if (!id) return null;
    return ServiceModel.findById(id).lean();
  }  
  async findAndDeleteService(id: string): Promise<IService> {
    const deleted = await ServiceModel.findByIdAndDelete(id).lean();  
    if (!deleted) {
      throw new Error("Failed to delete service");
    }  
    return deleted;
  }

  
  async changeStatusById(id: string, status: string,admin:string): Promise<boolean> {
    const data ={
      "status":status,
      "updatedBy":admin
    }
    const updated = await ServiceModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("Failed to update service");
    }
    return updated?true:false;
  }

  //subcategories services
  async serviceSubcategories(page: number = 1, limit: number = 3): Promise<IServiceSubcategories[]> {
    const skip = (page - 1) * limit;
    const services = await SubcategoryModel.find()
     .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .populate({
      path: 'serviceId', 
      select: 'serviceName status'  
    })
    .exec();
    return services;
  }

  
  async isExistServicesubCategory(subcategoryName: string,serviceId:string,id:string): Promise<boolean | null> {
    const subcategory =subcategoryName.toLocaleUpperCase()
    const filter: any = { subcategory,serviceId };
    if (id) filter._id = { $ne: id };
    const doc = await SubcategoryModel.findOne(filter).lean();
    return !!doc;     
}
async addSubcategory(data: IServiceSubcategories): Promise<IServiceSubcategories> {
  const createService = await SubcategoryModel.create(data);
  const { _id, ...rest } = createService.toObject();
  return createService;
}

async subcategoryFindById(id: string): Promise<IServiceSubcategories | null> {
  if (!id) return null;
  return SubcategoryModel.findById(id).lean();
}  
async editSubcategory(id: string, data: Partial<IServiceSubcategories>): Promise<IServiceSubcategories> {
  const updated = await SubcategoryModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, lean: true }
  );
  if (!updated) {
    throw new Error("Failed to update subcategory");
  }
  return updated;
}


async changesubcategoryStatusById(id: string, status: string,admin:string): Promise<boolean> {
  const data ={
    "status":status,
    "updatedBy":admin
  }
  const updated = await SubcategoryModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, lean: true }
  );
  if (!updated) {
    throw new Error("Failed to update service");
  }
  return updated?true:false;
}
async findAndDeleteSubcategory(id: string): Promise<IServiceSubcategories> {
  const deleted = await SubcategoryModel.findByIdAndDelete(id).lean();  
  if (!deleted) {
    throw new Error("Failed to delete subcategory");
  }  
  return deleted;
}



}

