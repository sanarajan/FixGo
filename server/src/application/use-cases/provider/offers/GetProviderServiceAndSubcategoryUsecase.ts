import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../domain/repositories/provider/IproviderServicesRepository";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IServiceSubcategories } from "../../../../domain/models/IServiceSubcategories";
@injectable()
export class GetProviderServiceAndSubcategoryUsecase {
  constructor(
    @inject("IproviderServicesRepository")
    private providerServiceRepo: IproviderServicesRepository
  ) {}

  async execute(providerId: string) {
    const providerServices = await this.providerServiceRepo.getByProviderId(
      providerId
    );

    if (!providerServices) return { services: [] };

   

    return {
      services: Array.from(
        providerServices.reduce((map, ps) => {
          const service = ps.serviceId as any;
          if (!service || map.has(service._id.toString())) return map;

          map.set(service._id.toString(), {
            _id: service._id.toString(),
            serviceName: service.serviceName,
            providerServiceId: ps._id.toString(),
          });

          return map;
        }, new Map<string, { _id: string; serviceName: string; providerServiceId: string }>())
      ).map(([_, value]) => value), // ✅ Only return the values, not [key, value] pairs
    };
  }
}
