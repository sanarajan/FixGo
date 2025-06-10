// src/infrastructure/repositories/UserRepositoryImpl.ts
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRepository";
import { User } from "../../../domain/models/User";
import { UserModel } from "../../../infrastructure/database/models/UserModel";
import { IService } from "../../../domain/models/Iservices";
import { IServiceSubcategories } from "../../../domain/models/IServiceSubcategories";
import { SubcategoryModel } from "../models/SubcategoryModel";
import { ServiceModel } from "../../../infrastructure/database/models/ServiceModel";
import { GroupedProviderService } from "../../../domain/models/GroupProviderServices";
import { ProviderServicesModel } from "../models/ProviderServicesModel";
import { StaffServicesModel } from "../models/StaffServicesModel";
import mongoose, { Types } from "mongoose";
import { AddressModel } from "../models/AddressModel";

export class CustomerRepositoryImpl implements ICustomerRepository {
  async getAllCustomers(page: number = 1, limit: number = 3): Promise<User[]> {
    const skip = (page - 1) * limit;
    const customers = await UserModel.find({ role: "customer" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return this.mapUsers(customers);
  }

  async getAllProviders(page: number = 1, limit: number = 3): Promise<User[]> {
    const skip = (page - 1) * limit;
    const providers = await UserModel.find({
      role: { $in: ["provider", "worker"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return this.mapUsers(providers);
  }

  private mapUsers(users: any[]): User[] {
    return users.map(
      (user): User => ({
        _id: user._id?.toString(),
        fullname: user.fullname ?? undefined,
        companyName: user.companyName ?? undefined,
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role,
        providerId: user.providerId?.toString() ?? undefined,
        status: user.status,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        image: user.image,
      })
    );
  }

  async adminServices(
    type: string,
    serviceId?: string
  ): Promise<IService[] | IServiceSubcategories[]> {
    if (type === "service") {
      return await ServiceModel.find({ status: "Active" })
        .sort({ createdAt: -1 })
        .lean();
    } else if (type === "subcatgory" && serviceId) {
      return await SubcategoryModel.find({
        serviceId,
        status: "Active",
      }).lean();
    } else {
      throw new Error("Invalid type or missing service ID");
    }
  }

  async providerServiceInLocation(
    mainServiceId: string,
    serviceId: string,
    coordinates?: { lat: number; lng: number },
    providerId?: string
  ): Promise<GroupedProviderService[] | null> {
    try {
      if (serviceId) {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
          throw new Error("Invalid serviceId");
        }
      }
      const pipeline: any[] = [];

      // 1. Geo filter on addresses

      if (coordinates) {
        pipeline.push({
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [coordinates.lng, coordinates.lat],
            },
            distanceField: "distance",
            spherical: true,
            key: "geoLocation",
            query: {
              status: "Active",
              current: true,
            },
            distanceMultiplier: 0.001,
            maxDistance: 20000,
          },
        });
      }

      // Lookup provider services per user
      pipeline.push({
        $lookup: {
          from: "providerservices",
          localField: "createdBy",
          foreignField: "createdBy",
          as: "providerServices",
        },
      });

      // Unwind providerServices so each doc is one service per provider
      pipeline.push({ $unwind: "$providerServices" });

      // Filter by serviceId or mainServiceId (only if valid)
      if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
        pipeline.push({
          $match: {
            "providerServices.subcategoryId": new mongoose.Types.ObjectId(
              serviceId
            ),
          },
        });
      } else if (
        mainServiceId &&
        mongoose.Types.ObjectId.isValid(mainServiceId)
      ) {
        pipeline.push({
          $match: {
            "providerServices.serviceId": new mongoose.Types.ObjectId(
              mainServiceId
            ),
          },
        });
      }

      // Lookup user details for each doc
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      });
      pipeline.push({ $unwind: "$userDetails" });
      if (providerId && mongoose.Types.ObjectId.isValid(providerId)) {
        pipeline.push({
          $match: {
            "userDetails._id": new mongoose.Types.ObjectId(providerId),
          },
        });
      }
      // Lookup subcategory for each providerService
      pipeline.push({
        $lookup: {
          from: "subcategories",
          localField: "providerServices.subcategoryId",
          foreignField: "_id",
          as: "subcategoryDetails",
        },
      });
      pipeline.push({ $unwind: "$subcategoryDetails" });

      // Lookup service for each providerService
      pipeline.push({
        $lookup: {
          from: "services",
          localField: "providerServices.serviceId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      });
      pipeline.push({ $unwind: "$serviceDetails" });

      // Group by provider + subcategory to avoid duplicates of the same subcategory per provider
      pipeline.push({
        $group: {
          _id: {
            providerId: "$userDetails._id",
            subcategoryId: "$subcategoryDetails._id",
            providerServiceId: "$providerServices._id",
            serviceId: "$serviceDetails._id",
          },
          fullname: { $first: "$userDetails.fullname" },
          phone: { $first: "$userDetails.phone" },
          image: { $first: "$userDetails.image" },
          providerservImg: { $first: "$providerServices.image" },
          description: { $first: "$providerServices.description" },
          features: { $first: "$providerServices.features" },
          serviceName: { $first: "$serviceDetails.serviceName" },
          subcategoryName: { $first: "$subcategoryDetails.subcategory" },
          distance: { $first: "$distance" },
        },
      });

      // Project final shape
      pipeline.push({
        $project: {
          _id: 1,
          providerId: "$_id.providerId",
          fullname: 1,
          providerservImg: 1,
          phone: 1,
          image: 1,
          description: 1,
          features: 1,
          serviceName: 1,
          subcategoryName: 1,
          distance: 1,
        },
      });

      const results = await AddressModel.aggregate(pipeline);
      console.log(JSON.stringify(results, null, 2) + " result");
      return results;
    } catch (err: any) {
      console.error(
        "Error getting provider services in location:",
        err.message
      );
      throw err;
    }
  }

  //  async providerServiceInLocation(
  //     serviceId: string,coordinates?:{
  //     lat: number;
  //     lng: number;
  //   }
  //   ): Promise<GroupedProviderService[] | null> {
  //     try {
  //       const results = await ProviderServicesModel.aggregate([
  //         { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
  //         {
  //           $lookup: {
  //             from: "services", // collection name
  //             localField: "serviceId",
  //             foreignField: "_id",
  //             as: "serviceDetails",
  //           },
  //         },
  //         {
  //           $unwind: "$serviceDetails",
  //         },
  //         {
  //           $lookup: {
  //             from: "subcategories",
  //             localField: "subcategoryId",
  //             foreignField: "_id",
  //             as: "subcategoryDetails",
  //           },
  //         },
  //        {
  //   $unwind: {
  //     path: "$subcategoryDetails",
  //     preserveNullAndEmptyArrays: true
  //   }
  // },
  //         {
  //           $group: {
  //             _id: "$serviceDetails._id",
  //             serviceName: { $first: "$serviceDetails.serviceName" },
  //             image: { $first: "$image" },
  //             description: { $first: "$description" },
  //             features: { $first: "$features" },
  //             subcategories: {
  //               $addToSet: {
  //                 _id: "$subcategoryDetails._id",
  //                 name: "$subcategoryDetails.subcategory",
  //               },
  //             },
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             serviceId: "$_id",
  //             serviceName: 1,
  //             subcategories: 1,
  //           },
  //         },
  //       ]);
  //       return results;
  //     } catch (err: any) {
  //       console.error(" Error saving provider service:", err.message);
  //       throw err;
  //     }
  //   }
  async serviceCategories(
    serviceId?: string
  ): Promise<IServiceSubcategories[]> {
    if (serviceId) {
      return await SubcategoryModel.find({
        serviceId,
        status: "Active",
      }).lean();
    } else {
      throw new Error("Invalid type or missing service ID");
    }
  }
}
