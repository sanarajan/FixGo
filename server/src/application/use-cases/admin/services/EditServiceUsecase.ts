import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IService,tokenUserData} from "../../../../domain/models/Iservices"
@injectable()
export class EditServiceUseCase {
  constructor(
    @inject("IServiceRepository") private repo: IServiceRepository,
  ) {}

  async execute(admin: tokenUserData, id: string, data: Partial<IService>): Promise<IService> {
    // optional: verify admin role
    const current = await this.repo.serviceFindById(id);
    if (!current) {
      const err = new Error("Service not exist") as any;
      err.status = 404;
      throw err;
    }

    if (data.serviceName ) {
      console.log("before checking is exist")
        const nameTaken = await this.repo.isExistService(data.serviceName, id);
        if (nameTaken) {      console.log(" checking is exist")

          const err = new Error("Service name already exist") as any;
          err.status = 400;
          throw err;
        }
      }
    const updated = await this.repo.editService(id, {
      serviceName: data.serviceName?.toLocaleUpperCase() ,
      status: data.status ,
      updatedBy: admin.id,
    });

    return updated;
  }
}
