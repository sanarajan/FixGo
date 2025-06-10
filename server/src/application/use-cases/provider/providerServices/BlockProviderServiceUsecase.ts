import { inject, injectable } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
@injectable()
@injectable()
export class BlockProviderServiceUsecase {
  constructor(
    @inject("IproviderServicesRepository") private repo: IproviderServicesRepository,
  ) {}

  async execute(id: string,status:string,admin:string): Promise<boolean> {
    const current = await this.repo.providerServiceFindById(id);
    if (!current) {
      const err = new Error("Service not exist") as any;
      err.status = 404;
      throw err;
    }
       const updated = await this.repo.changeProServiceStatusById(id,status,admin);
    return updated?true:false;
  }
}
