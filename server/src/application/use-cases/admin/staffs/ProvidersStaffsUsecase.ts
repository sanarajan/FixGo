import { injectable, inject } from "tsyringe";
import { User } from "../../../../domain/models/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
interface StaffListResponse {
  data: User[];
  totalCount: number;

}
@injectable()
export class ProvidersStaffsUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    
  ) {}

  async execute(page?: number, limit?: number, providerId?:string): Promise<StaffListResponse> {
    const {data,totalCount}= await this.userRepository.providersStaffList(page, limit,providerId);

    return {data,totalCount}
  }
}
