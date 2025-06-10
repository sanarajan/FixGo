import { injectable } from "tsyringe";
import { User } from "../../../domain/models/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { forgotEmail } from "../../../domain/models/forgotEmail";
import { ForgotClick } from "../../../domain/models/ForgotClick";
import mongoose, { Types } from "mongoose";
import { ForgotClickModel } from "../models/ForgotClickModel";
import { Iaddresses } from "../../../domain/models/Iaddresses";
import { AddressModel } from "../models/AddressModel";

interface StaffListResponse {
  data: User[];
  totalCount: number;
}
@injectable()
export class UserRepositoryImpl implements UserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await UserModel.create(user);
    const { _id, ...rest } = createdUser.toObject();

    return {
      ...rest,
      _id: _id.toString(),
      providerId: createdUser.providerId?.toString() ?? undefined,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await UserModel.findOne({ phone }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }

  async findCustomerById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id: id, role: "customer" }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }
  async findByRoleAndId(id: string, role: string): Promise<boolean | null> {
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
    const user = await UserModel.findOne({ _id: id.trim(), role }).lean();
    if (!user) return false;
    return true;
  }
  async findProviderById(id: string): Promise<User | null> {
    console.log(id+"here comes")
    const user = await UserModel.findOne({
      _id: id
      // $or: [{ role: "provider" }, { role: "worker" }],
    }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }
  async emailVerification(
    email: string,
    userType: string
  ): Promise<User | null> {
    let user: any = null;

    if (userType === "provider") {
      user = await UserModel.findOne({
        email,
        $or: [{ role: "provider" }, { role: "worker" }],
      }).lean();
    } else {
      user = await UserModel.findOne({ email, role: userType }).lean();
    }
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }

  async googleUserTypeCheck(
    email: string,
    userType: string
  ): Promise<forgotEmail> {
    const user = await UserModel.findOne({ email, role: userType }).lean();
    return {
      _id: user?._id?.toString() ?? null,
      isValid: !!user,
      user: user
        ? ({
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString(),
          } as User)
        : null, // make sure 'User | null' is allowed in your type
    };
  }

  async updatePasswordById(
    id: string,
    hashedPassword: string
  ): Promise<boolean> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
    return true;
  }

  async setForgotPasswordLink(
    userId: string | Types.ObjectId,
    token: string,
    expires: Date
  ): Promise<void> {
    const existingRecord = await ForgotClickModel.findOne({ userId });

    if (existingRecord) {
      // If the record exists, update it

      existingRecord.token = token;
      existingRecord.expiresAt = expires;
      await existingRecord.save(); // Save the updated record
    } else {
      // If the record doesn't exist, create a new one
      const newRecord = new ForgotClickModel({
        userId,
        token: token,
        expiresAt: expires,
        clicked: false, // Assuming 'clicked' is false initially
        linkCreatedAt: new Date(),
      });
      await newRecord.save(); // Save the new record
    }
  }
  async findForgotClickByToken(token: string): Promise<ForgotClick | null> {
    const record = await ForgotClickModel.findOne({ token }).lean();
    return record;
  }

  async updateClickedTrue(userId: string): Promise<ForgotClick | null> {
    const existingRecord = await ForgotClickModel.findOne({ userId });

    if (existingRecord) {
      existingRecord.clicked = true;
      await existingRecord.save();
      return existingRecord;
    }
    return null;
  }

  async changeStatusById(
    id: string,
    status: string,
    admin: string
  ): Promise<boolean> {
    // console.log(status + " data");

    const data = {
      status: status,
      // "updatedBy":admin
    };
    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("Failed to update Provider");
    }
    return updated ? true : false;
  }

 async addAddress(addressData: Iaddresses): Promise<boolean | null> {
  try {
    console.log('addAddress received longitude:', addressData.longitude, 'latitude:', addressData.latitude);

    if (
      typeof addressData.longitude !== 'number' ||
      typeof addressData.latitude !== 'number' ||
      isNaN(addressData.longitude) ||
      isNaN(addressData.latitude)
    ) {
      console.error('Invalid coordinates received:', addressData.longitude, addressData.latitude);
      throw new Error('Invalid coordinates provided for geoLocation.');
    }

    const geoLocation = {
      type: 'Point',
      coordinates: [addressData.longitude, addressData.latitude],
    };

    if (addressData._id && typeof addressData._id === "string" && mongoose.Types.ObjectId.isValid(addressData._id)) {
      const objectId = new mongoose.Types.ObjectId(addressData._id);
      await AddressModel.updateOne(
        { _id: objectId },
        {
          $set: {
            location: addressData.location,
            longitude: addressData.longitude,
            latitude: addressData.latitude,
            current: addressData.current,
            geoLocation: geoLocation,
          },
        }
      );
    } else {
      await AddressModel.create({
        ...addressData,
        geoLocation: geoLocation,
      });
    }

    return true;
  } catch (error) {
    console.error("Add or update address error:", error);
    return null;
  }
}



  async staffList(
  page: number = 1,
  limit: number = 3,
  adminId: string
): Promise<StaffListResponse> {
  const skip = (page - 1) * limit;
  const result = await UserModel.aggregate([
    { $match: { type: "staff" } },

    {
      $lookup: {
        from: "staffservices",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$staffId", "$$userId"] },
                  { $eq: ["$createdBy", new mongoose.Types.ObjectId(adminId)] },
                  { $eq: ["$status", "Active"] },
                ],
              },
            },
          },
        ],
        as: "staffServices",
      },
    },
    {
      $match: {
        staffServices: { $ne: [] }, // Keep only users with active staff services
      },
    },

    {
      $lookup: {
        from: "subcategories",
        localField: "staffServices.subcategoryId",
        foreignField: "_id",
        as: "subcategories",
      },
    },

    {
      $lookup: {
        from: "services",
        localField: "subcategories.serviceId",
        foreignField: "_id",
        as: "services",
      },
    },

    {
      $lookup: {
        from: "addresses",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  { $eq: ["$current", true] },
                ],
              },
            },
          },
          {
            $project: {
              location: 1,
              longitude: 1,
              latitude: 1,
              _id: 0,
            },
          },
        ],
        as: "address",
      },
    },
    {
      $addFields: {
        currentAddress: { $arrayElemAt: ["$address", 0] },
      },
    },

    {
      $project: {
        createdAt: 1,
        _id: 1,
        fullname: 1,
        email: 1,
        phone: 1,
        image: 1,
        status: 1,
        role: 1,
        providerId: 1,
        username: 1,
        staffServices: 1,
        "address.location": "$currentAddress.location",
        "address.longitude": "$currentAddress.longitude",
        "address.latitude": "$currentAddress.latitude",
        subcategories: {
          $map: {
            input: "$subcategories",
            as: "sc",
            in: {
              _id: "$$sc._id",
              subcategory: "$$sc.subcategory",
              serviceId: "$$sc.serviceId",
            },
          },
        },
        services: {
          $map: {
            input: "$services",
            as: "srv",
            in: {
              _id: "$$srv._id",
              serviceName: "$$srv.serviceName",
            },
          },
        },
      },
    },

    // ✅ Sort staff by their own createdAt in DESCENDING order (latest first)
    {
      $sort: { createdAt: -1 },
    },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

 

    const staffs = result[0].data;
    const count = result[0].totalCount[0]?.count || 0;
    // console.log(JSON.stringify(staffs.services, null, 2));
    return {
      data: staffs.map((staff: any) => ({
        ...staff,
        _id: staff._id?.toString(),
      })) as User[],
      totalCount: count,
    };
  }  
  async findByEmailAndId(email: string, id: string): Promise<boolean | null> {
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
    const user = await UserModel.findOne({
  _id: { $ne: id.trim() },
  email,
}).lean();
    if (!user) return false;
    return true;
  }
  async findByUsernameAndId(id: string, username?: string): Promise<boolean | null> {
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
    const user = await UserModel.findOne({
  _id: { $ne: id.trim() },
  username,
}).lean();
    
    if (!user) return false;
    return true;
  }
   async findByPhoneAndId(id: string, phone: string|null): Promise<boolean | null> {
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
     const user = await UserModel.findOne({
  _id: { $ne: id.trim() },
  phone,
}).lean();
    if (!user) return false;
    return true;
  }

  
 async editStaff(id:string,user: User): Promise<User|null> {
     if (!mongoose.Types.ObjectId.isValid(id.trim())) {
    return null;
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    id.trim(),
    { $set: user },
    { new: true, lean: true } // `new: true` returns the updated doc
  );

  if (!updatedUser) return null;
 const { _id, ...rest } = updatedUser;
    return {
      ...rest,
      _id: _id.toString(),
      providerId: updatedUser.providerId?.toString() ?? undefined,
    };
  }

 async getCurrentAddressByUserId(staffId: string): Promise<{ latitude: number | null, longitude: number | null,location:string|null,_id:string|null }> {
  const address = await AddressModel.findOne({ userId: staffId, current: true });
  return {
    latitude: address?.latitude ?? null,
    longitude: address?.longitude ?? null,
    _id: address?._id?.toString() ?? null,
    location: address?.location ?? null,
  };
}

 async findStaffWithIdAndType(id: string): Promise<User | null> {
    const user = await UserModel.findOne({
      _id: id,
      type:"staff",
      $or: [{ role: "provider" }, { role: "worker" }],
    }).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }

async changeStaffStatusByIdAndType(
    id: string,
    status: string,
    admin: string
  ): Promise<boolean> {
    // console.log(status + " data");
if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
    const data = {
      status: status,
      // "updatedBy":admin
    };
    const updated = await UserModel.findOneAndUpdate(
  {
    _id: id, // Make sure `id` is a string or ObjectId
    type: "staff",
    role: { $in: ["provider", "worker"] }
  },
  { $set: data },
  { new: true, lean: true }
);
    if (!updated) {
      throw new Error("Failed to update Provider");
    }
    return updated ? true : false;
  }

  
  async providerProfileEdit(
    id: string,
    image: string
  
  ): Promise<string|boolean|null> {
if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return false;
    }
    const data = {
      image: image,
      // "updatedBy":admin
    };
    const updated = await UserModel.findOneAndUpdate(
  {
    _id: id
   
  },
  { $set: data },
  { new: true, lean: true }
);
   
 console.log(updated?.image+"  data impl")
    if (!updated) {
      throw new Error("Failed to update Provider");
    }
    return updated.image ;
  }

  
  async showProvider(
   
    id:string

  ): Promise<User | null> {
    const result = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id)} },   

   
      {
        $lookup: {
          from: "addresses",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$current", true] },
                  ],
                },
              },
            },
            { $project: { location: 1, longitude: 1, latitude: 1, _id: 0 } },
          ],
          as: "address",
        },
      },
      {
        $addFields: {
          currentAddress: { $arrayElemAt: ["$address", 0] },
        },
      },

      {
        $project: {
          _id: 1,
          fullname: 1,
          email: 1,
          phone: 1,
          image: 1,
          status: 1,
          role: 1,
          providerId: 1,
          username: 1,        
          "address.location": "$currentAddress.location",
          "address.longitude": "$currentAddress.longitude",
          "address.latitude": "$currentAddress.latitude",       
         
        },
      },
     
    ]);
    const staffs = result[0];
   
    console.log(JSON.stringify(staffs[0], null, 2));
    return {
    ...staffs,
    _id: staffs._id?.toString(),
  } as User;
  } 
  
  
async   fetchUserById
(    id: string, ): Promise<User | null> {
    const user = await UserModel.findOne({ _id: id}).lean();
    if (!user) return null;

    return {
      ...user,
      _id: user._id.toString(),
      providerId: user.providerId?.toString() ?? undefined,
    };
  }
}
