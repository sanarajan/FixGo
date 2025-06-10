import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/models/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { Iaddresses } from "../../../../domain/models/Iaddresses";
import mongoose, { Types } from "mongoose";

@injectable()
export class CustomerAddressManageUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  public async execute(
    customerId: string,
    location: string,
    coords: { latitude: number; longitude: number }
  ): Promise<boolean | null> {
    // Create user

    let id = "";
    let isSameLocation = false;
    let address = null;

    if (customerId) {
      const existingAddress =
        await this.userRepository.getCurrentAddressByUserId(customerId);
      if (existingAddress) {
        isSameLocation =
          existingAddress?.latitude === coords.latitude &&
          existingAddress.longitude === coords.longitude;
        if (
          existingAddress &&
          typeof existingAddress._id === "string" &&
          mongoose.Types.ObjectId.isValid(existingAddress._id)
        ) {
          id = existingAddress._id;
        }
      }

      if (!isSameLocation) {
        const addressData: Partial<Iaddresses> = {
          ...(id ? { _id: id } : {}),
          userId: customerId as string,
          location: location,
          createdBy: customerId,
          longitude: coords.longitude,
          latitude: coords.latitude,
          geoLocation: {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude], // <== Correct!
          },

          current: true,
        };
        address = await this.userRepository.addAddress(
          addressData as Iaddresses
        );
      }
    }
    return address;
  }
}
