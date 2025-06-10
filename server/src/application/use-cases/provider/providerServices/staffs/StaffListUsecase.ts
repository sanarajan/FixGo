import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../../domain/repositories/provider/IproviderServicesRepository";
import { IproviderServices } from "../../../../../domain/models/IproviderServices";
import { tokenUserData } from "../../../../../domain/models/Iservices";
import { User } from "../../../../../domain/models/User";
import { UserRepository } from "../../../../../domain/repositories/UserRepository";
import { ServiceModel } from "../../../../../infrastructure/database/models/ServiceModel";
import { SubcategoryModel } from "../../../../../infrastructure/database/models/SubcategoryModel";
import { ProviderServicesModel } from "../../../../../infrastructure/database/models/ProviderServicesModel";
import {Iaddresses} from "../../../../../domain/models/Iaddresses"
interface StaffListResponse {
  data: User[];
  totalCount: number;

}
@injectable()
export class StaffListUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("IproviderServicesRepository")
    private staffServiceRepo: IproviderServicesRepository
  ) {}

  async execute(page?: number, limit?: number, adminId?:string): Promise<StaffListResponse> {
    const {data,totalCount}= await this.userRepository.staffList(page, limit,adminId);

    return {data,totalCount}
  }
}
