
import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import {IService,tokenUserData} from "../../../../domain/models/Iservices"

@injectable()
export class AddServicesuseCase {
  constructor(
    @inject("IServiceRepository") private IserviceRepo: IServiceRepository,
  ) {}

  public async execute(userAdmin:tokenUserData,data: IService): Promise<IService> {
    console.log(userAdmin.id+" usecaseservice")
    const serviceName = data.serviceName
    const isExistService = await this.IserviceRepo.isExistService(serviceName);
    if (isExistService) {
      const error = new Error("Service already exists");
      (error as any).status = 400;
      throw error;
    }   

   
    const servicedata = {
        serviceName: data.serviceName.toLocaleUpperCase(),
        status: data.status,
        createdBy: userAdmin.id
      };
      
      const createdService = await this.IserviceRepo.addService(servicedata);
      if(!createdService){
        const error = new Error("Service not saved");
        (error as any).status = 400;
        throw error;
      }
    return createdService;
  }
}
