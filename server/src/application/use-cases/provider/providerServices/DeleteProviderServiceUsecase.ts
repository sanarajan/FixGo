import { inject, injectable } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
@injectable()
export class DeleteProviderServiceUsecase {
  constructor(
    @inject("IproviderServicesRepository") private repo: IproviderServicesRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    // optional: verify admin role
    const current = await this.repo.providerServiceFindById(id);
    if (!current) {
      const err = new Error("Provider service not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.findAndDeleteProviderService(id);
    return updated?true:false;
  }
}
