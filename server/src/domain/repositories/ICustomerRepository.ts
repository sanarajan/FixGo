// src/domain/interfaces/ICustomerRepository.ts
import { User } from "../models/User";
import { IService } from "../models/Iservices";
import { IServiceSubcategories } from "../models/IServiceSubcategories";
import { IproviderServices } from "../models/IproviderServices";
import { GroupedProviderService } from "../../domain/models/GroupProviderServices";

export interface ICustomerRepository {
  getAllCustomers(page?: number, limit?: number): Promise<User[]>;
  getAllProviders(page?: number, limit?: number): Promise<User[]>;
  adminServices(
    type: string,
    service?: string
  ): Promise<IService[] | IServiceSubcategories[]>;

  providerServiceInLocation(
    mainServiceId:string,
    id?: string,
    coordinates?: {
      lat: number;
      lng: number;
    },providerId?:string
  ): Promise<GroupedProviderService[] | null>;

  serviceCategories(serviceId: string): Promise<IServiceSubcategories[]>;
}
