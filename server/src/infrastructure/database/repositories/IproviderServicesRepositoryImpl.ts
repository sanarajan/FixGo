import { injectable } from "tsyringe";
import { IproviderServicesRepository } from "../../../domain/repositories/provider/IproviderServicesRepository";
import { ProviderServicesModel } from "../models/ProviderServicesModel";
import { StaffServicesModel } from "../models/StaffServicesModel";
import { tokenUserData } from "../../../domain/models/Iservices";
import { IproviderServices } from "../../../domain/models/IproviderServices";
// import {SubcategoryModel} from "../models/SubcategoryModel"
import { ServiceModel, IService } from "../models/ServiceModel";
import mongoose, { Types } from "mongoose";

import { GroupedProviderService } from "../../../domain/models/GroupProviderServices";
@injectable()
export class IproviderServicesRepositoryImpl
  implements IproviderServicesRepository
{
  async providerServices(
    page: number = 1,
    limit: number = 3,
    adminId: string
  ): Promise<IproviderServices[] | null> {
    const skip = (page - 1) * limit;
    if (!mongoose.Types.ObjectId.isValid(adminId.trim())) {
      return null;
    }
    const services = await ProviderServicesModel.find({ createdBy: adminId })
     .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate({
        path: "serviceId",
        select: "serviceName status",
      })
      .populate({
        path: "subcategoryId",
        select: "subcategory status",
      })
      .exec();
    return services;
  }

  async isExistProviderService(
    serviceId: string,
    subcategory: string,
    providerId: string|Types.ObjectId,
    id?: string
  ): Promise<boolean | null> {
    const filter: any = { subcategoryId: subcategory, serviceId,createdBy:providerId };
    if (id) filter._id = { $ne: id };
    const doc = await ProviderServicesModel.findOne(filter).lean();
    return !!doc;
  }

  async addProviderService(
    data: IproviderServices
  ): Promise<IproviderServices> {
    try {
      const createService = await ProviderServicesModel.create(data);
      return createService;
    } catch (err: any) {
      console.error("❌ Error saving provider service:", err.message);
      throw err;
    }
  }

  async providerServiceFindById(id: string): Promise<IproviderServices | null> {
    if (!id) return null;
    return ProviderServicesModel.findById(id).lean();
  }
  async editProviderService(
    id: string,
    data: Partial<IproviderServices>
  ): Promise<IproviderServices> {
    const updated = await ProviderServicesModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("Failed to update service");
    }
    return updated;
  }

  async findAndDeleteProviderService(id: string): Promise<IproviderServices> {
    const deleted = await ProviderServicesModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw new Error("Failed to delete service");
    }
    return deleted;
  }

  async changeProServiceStatusById(
    id: string,
    status: string,
    admin: string
  ): Promise<boolean> {
    const data = {
      status: status,
      updatedBy: admin,
    };
    const updated = await ProviderServicesModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("Failed to update ProviderService");
    }
    return updated ? true : false;
  }

  async GroupProviderServices(
    adminId: string
  ): Promise<GroupedProviderService[] | null> {
    try {
      const results = await ProviderServicesModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
        {
          $lookup: {
            from: "services", // collection name
            localField: "serviceId",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        {
          $unwind: "$serviceDetails",
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryDetails",
          },
        },
        {
          $unwind: "$subcategoryDetails",
        },
        {
          $group: {
            _id: "$serviceDetails._id",
            serviceName: { $first: "$serviceDetails.serviceName" },
            subcategories: {
              $addToSet: {
                _id: "$subcategoryDetails._id",
                name: "$subcategoryDetails.subcategory",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            serviceId: "$_id",
            serviceName: 1,
            subcategories: 1,
          },
        },
      ]);

      return results;
    } catch (err: any) {
      console.error("❌ Error saving provider service:", err.message);
      throw err;
    }
  }
  async addMultipleStaffServices(
    data: Partial<IproviderServices>[]
  ): Promise<IproviderServices[]> {
    const createdServices = await StaffServicesModel.insertMany(data);
 //   console.log(createdServices + "  createdservice");
    return createdServices.map((doc) => doc.toObject());
  }

  async removeStaffService(
    staffId: string,
    serviceId: string,
    subcategoryId: string
  ): Promise<void> {

    console.log("deleting start")
  const result = await StaffServicesModel.deleteOne({
  staffId: new Types.ObjectId(staffId),
  serviceId: new Types.ObjectId(serviceId),
  subcategoryId: new Types.ObjectId(subcategoryId),
});

console.log("Delete result:", result);

  }
}
