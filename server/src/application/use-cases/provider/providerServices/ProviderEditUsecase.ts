import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/models/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { Iaddresses } from "../../../../domain/models/Iaddresses";
@injectable()
export class ProviderEditUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  public async execute(
    user: User,
    adminId: string,
    location: string,
    coords: { latitude: number; longitude: number }
  ): Promise<User> {
    if (user.username) {
      const existingUsername = await this.userRepository.findByUsernameAndId?.(
        adminId,
        user.username ?? undefined
      );

      if (existingUsername)
        throw Object.assign(new Error("Username already exists"), {
          status: 400,
        });
    }
    if(user.phone){
    const existingPhone = await this.userRepository.findByPhoneAndId?.(
      adminId,
      user.phone ?? undefined
    );
    if (existingPhone)
      throw Object.assign(new Error("Phone number already exists"), {
        status: 400,
      });
    }

    // Create user
    // user.role = "provider";
    user.providerId = adminId;
    user.status = "Active";
    if (!user.fullname || user.fullname.trim() === "") {
      user.username = "";
    } else {
      user.username = user.username
        ? user.username.trim().toLowerCase().replace(" ", "")
        : "";
    }
    const createdUser = await this.userRepository.editStaff(adminId, user);

    if (adminId) {
      const existingAddress =
        await this.userRepository.getCurrentAddressByUserId(adminId);
      console.log(
        existingAddress.latitude +
          " address longitude" +
          existingAddress.longitude
      );
      const isSameLocation =
        existingAddress &&
        existingAddress?.latitude === coords.latitude &&
        existingAddress.longitude === coords.longitude;

      if (!isSameLocation) {
        const addressData: Partial<Iaddresses> = {
          _id: existingAddress?._id,
          userId: adminId as string,
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
