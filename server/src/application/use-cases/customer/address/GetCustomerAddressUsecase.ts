import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/models/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { Iaddresses } from "../../../../domain/models/Iaddresses";
import mongoose, { Types } from "mongoose";

@injectable()
export class GetCustomerAddressUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository
  ) {}

  public async execute(
    customerId: string
  ): Promise<{
    latitude: number | null;
    longitude: number | null;
    _id: string | null;
  } | null> {
    
    if (customerId) {
      const existingAddress =
        await this.userRepository.getCurrentAddressByUserId(customerId);
      if (existingAddress) {
        return existingAddress;
      }
    }
    return null;
  }
}
