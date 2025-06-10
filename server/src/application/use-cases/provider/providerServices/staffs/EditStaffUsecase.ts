import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../../domain/repositories/provider/IproviderServicesRepository";
import { IproviderServices } from "../../../../../domain/models/IproviderServices";
import { User } from "../../../../../domain/models/User";
import { UserRepository } from "../../../../../domain/repositories/UserRepository";
import { ServiceModel } from "../../../../../infrastructure/database/models/ServiceModel";
import { SubcategoryModel } from "../../../../../infrastructure/database/models/SubcategoryModel";
import { ProviderServicesModel } from "../../../../../infrastructure/database/models/ProviderServicesModel";
import { Iaddresses } from "../../../../../domain/models/Iaddresses";
import {compareServices} from "../../../../../shared/helpers/PairServiceHelper"
@injectable()
export class EditStaffUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("IproviderServicesRepository")
    private staffServiceRepo: IproviderServicesRepository
  ) {}

  public async execute(
    user: User,
    services: IproviderServices[],
    adminId: string,
    location: string,
    coords: { latitude: number; longitude: number },
    id: string,
    oldServices: IproviderServices[]
  ): Promise<User> {

    const existingEmail = await this.userRepository.findByEmailAndId(
      user.email,
      id
    );
    if (existingEmail)
      throw Object.assign(new Error("Email already exists"), { status: 400 });
    if (user.username) {
      const existingUsername = await this.userRepository.findByUsernameAndId?.(
        id,
        user.username ?? undefined
      );

      if (existingUsername)
        throw Object.assign(new Error("Username already exists"), {
          status: 400,
        });
    }
    const existingPhone = await this.userRepository.findByPhoneAndId?.(
      id,
      user.phone ?? undefined
    );
    if (existingPhone)
      throw Object.assign(new Error("Phone number already exists"), {
        status: 400,
      });

    // Create user
    user.role = "provider";
    user.providerId = adminId;
    user.status = "Active";
    if (!user.fullname || user.fullname.trim() === "") {
      user.username = "";
    } else {
      user.username = user.username
        ? user.username.trim().toLowerCase().replace(" ", "")
        : "";
    }

    const createdUser = await this.userRepository.editStaff(id, user);


if (typeof services === "object" && services !== null && !Array.isArray(services)) {
 const { toAdd, toRemove } = compareServices(services, oldServices);
const servicesToAdd =toAdd
const servicesToRemove =toRemove
 

  // const servicesToAdd = newPairs.filter(
  //   (np) =>
  //     !oldPairs.some(
  //       (op) =>
  //         String(op.serviceId) === String(np.serviceId) &&
  //         String(op.subcategoryId) === String(np.subcategoryId)
  //     )
  // );

  // const servicesToRemove = oldPairs.filter(
  //   (op) =>
  //     !newPairs.some(
  //       (np) =>
  //         String(np.serviceId) === String(op.serviceId) &&
  //         String(np.subcategoryId) === String(op.subcategoryId)
  //     )
  // );

  

  // Add new services
  const addData = [];
  for (const item of servicesToAdd) {
    const providerServiceDoc = await ProviderServicesModel.findOne({
      serviceId: item.serviceId,
      subcategoryId: item.subcategoryId,
      createdBy: adminId,
    }).select("_id");

    if (!providerServiceDoc) continue;

    const serviceDoc = await ServiceModel.findById(item.serviceId).select("serviceName");
    const subcategoryDoc = await SubcategoryModel.findById(item.subcategoryId).select("subcategory");

    addData.push({
      staffId: id,
      providerServiceId: providerServiceDoc._id,
      service: serviceDoc?.serviceName ?? "",
      serviceId: item.serviceId,
      subcategoryId: item.subcategoryId,
      subcategoryName: subcategoryDoc?.subcategory ?? "",
      createdBy: adminId,
    });
  }

  if (addData.length > 0) {
    await this.staffServiceRepo.addMultipleStaffServices(addData);
  }

  // Remove deleted services
  for (const item of servicesToRemove) {
    await this.staffServiceRepo.removeStaffService(
      id,
      item.serviceId.toString(),
      item.subcategoryId.toString()
    );
  }
}

      console.log(id,"locu")

    if (id) {
       const existingAddress = await this.userRepository.getCurrentAddressByUserId(id);
  console.log(existingAddress.latitude+" address longitude"+existingAddress.longitude)
  const isSameLocation =
    existingAddress &&
    existingAddress?.latitude === coords.latitude &&
    existingAddress.longitude === coords.longitude;
    console.log(isSameLocation+" islocation longitude")

     if (!isSameLocation) {
      console.log(location,"locu")
      const addressData: Partial<Iaddresses> = {
        _id:existingAddress?._id,
        userId: id as string,
        location: location,
        createdBy: adminId,
        longitude: coords.longitude,
        latitude: coords.latitude,
        current: true,
      };
      await this.userRepository.addAddress(addressData as Iaddresses);
    }
  }
    return user;
  }
}
