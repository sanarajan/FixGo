import { injectable, inject } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IService} from "../../../../domain/models/Iservices"
@injectable()
export class ListServicesUseCase { 
   constructor(
      @inject("IServiceRepository")
      private serviceRepo: IServiceRepository
    ) {}  


  async execute(page?: number, limit?: number): Promise<IService[]> {
    return this.serviceRepo.listServices(page, limit);
  }
}
