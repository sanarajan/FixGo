import { inject, injectable } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
import {GroupedProviderService} from "../../../../domain/models/GroupProviderServices"

@injectable()
export class ServiceListForStaffUsecase {
  constructor(
    @inject("IproviderServicesRepository") private repo: IproviderServicesRepository,
  ) {}

  async execute(adminId:string): Promise<GroupedProviderService[]|null> {
    // optional: verify admin role
    const current = await this.repo.ServiceListForStaff(adminId);
    if (!current) {
      const err = new Error("Provider services not exist") as any;
      err.status = 404;
      throw err;
    }
      
    return current;
  }
}
