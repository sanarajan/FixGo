import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/models/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { Iaddresses } from "../../../../domain/models/Iaddresses";
import mongoose, { Types } from "mongoose";

@injectable()
export class ProviderAddressEditUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  public async execute(
    user: User,
    adminId: string,
    location: string,
    coords: { latitude: number; longitude: number },
    id?: string
  ): Promise<User> {
    // Create user
    user.role = "provider";
    user.providerId = adminId;
    user.status = "Active";

    if (adminId) {
      const existingAddress =
        await this.userRepository.getCurrentAddressByUserId(adminId);
      const isSameLocation =
        existingAddress &&
        existingAddress?.latitude === coords.latitude &&
        existingAddress.longitude === coords.longitude;
      if (
        existingAddress &&
        typeof existingAddress._id === "string" &&
        mongoose.Types.ObjectId.isValid(existingAddress._id)
      ) {
        id = existingAddress._id;
      }

      if (!isSameLocation) {
        const addressData: Partial<Iaddresses> = {
          ...(id ? { _id: id } : {}),
          userId: adminId as string,
          location: location,
          createdBy: adminId,
          longitude: coords.longitude,
          latitude: coords.latitude,
           geoLocation: {
              type: "Point",
              coordinates: [coords.longitude, coords.latitude], // <== Correct!
          },
          current: true,
        };
        await this.userRepository.addAddress(addressData as Iaddresses);
      }
    }
    return user;
  }
}
