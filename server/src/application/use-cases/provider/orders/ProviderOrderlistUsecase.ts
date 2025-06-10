import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IOrder } from "../../../../domain/models/IOrder";
@injectable()

export class ProviderOrderlistUsecase {
  constructor(
    @inject("IOrderRepository") private oderRepo: IOrderRepository,
  ) {}


  async execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; totalCount: number }> {
    const { orders, totalCount } = await this.oderRepo.providerOrderList(providerId, page, limit);
    return { orders, totalCount };
  }

}
