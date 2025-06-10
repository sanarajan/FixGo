import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../../domain/repositories/provider/IproviderServicesRepository";
import { IproviderServices } from "../../../../../domain/models/IproviderServices";
import { User } from "../../../../../domain/models/User";
import { UserRepository } from "../../../../../domain/repositories/UserRepository";
import { ServiceModel } from "../../../../../infrastructure/database/models/ServiceModel";
import { SubcategoryModel } from "../../../../../infrastructure/database/models/SubcategoryModel";
import { ProviderServicesModel } from "../../../../../infrastructure/database/models/ProviderServicesModel";
import { Iaddresses } from "../../../../../domain/models/Iaddresses";

@injectable()
export class AddStaffUsecase {
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
    coords: { latitude: number; longitude: number }
  ): Promise<User> {
    // console.log(u)
    // const coords ={latitude:user.latitude}

    const existingEmail = await this.userRepository.findByEmail(user.email);
    if (existingEmail)
      throw Object.assign(new Error("Email already exists"), { status: 400 });
    if (user.username) {
      const existingUsername = await this.userRepository.findByUsername?.(
        user.username ?? undefined
      );

      if (existingUsername)
        throw Object.assign(new Error("Username already exists"), {
          status: 400,
        });
    }
    const existingPhone = await this.userRepository.findByPhone?.(
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
    // console.log("last servicedata:", JSON.stringify(services, null, 2), "length:", services.length);

    const createdUser = await this.userRepository.create(user);
    if (services && typeof services === "object") {

      const serviceData = [];

      for (const [serviceId, subcategories] of Object.entries(services)) {
        if (Array.isArray(subcategories)) {
          for (const subcategoryId of subcategories) {
            const serviceDoc = await ServiceModel.findById(serviceId).select(
              "serviceName"
            );
            const serviceName = serviceDoc?.serviceName ?? "";

            const subcategoryDoc = await SubcategoryModel.findById(
              subcategoryId
            ).select("subcategory");
            const subcategoryName = subcategoryDoc?.subcategory ?? "";

            const providerServiceDoc = await ProviderServicesModel.findOne({
              serviceId,
              subcategoryId,
              createdBy: adminId,
            }).select("_id");
            const providerServiceId = providerServiceDoc?._id;

            if (!providerServiceId) {
              console.warn(
                `Provider service not found for serviceId=${serviceId} and subcategoryId=${subcategoryId}`
              );
              continue;
            }

            serviceData.push({
              staffId: createdUser._id,
              providerServiceId,
              service: serviceName,
              serviceId: serviceId,
              subcategoryId,
              subcategoryName,
              createdBy: adminId,
             
            });
          }
        }
      }

      await this.staffServiceRepo.addMultipleStaffServices(serviceData);
      if (createdUser._id) {
        const addressData: Partial<Iaddresses> = {
          userId: createdUser._id as string,
          location: location,
          createdBy: adminId,
          longitude: coords.longitude,
          latitude: coords.latitude,
          current: true,
        };

        await this.userRepository.addAddress(addressData as Iaddresses);
      }
    }

    return createdUser;
  }
}
