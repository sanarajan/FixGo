import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IOrder } from "../../../../domain/models/IOrder";
@injectable()

export class CustomerOrderlistUsecase {
  constructor(
    @inject("IOrderRepository") private oderRepo: IOrderRepository,
  ) {}


  async execute(
    customerId: string,
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; totalCount: number }> {
    const { orders, totalCount } = await this.oderRepo.customerOrderList(customerId, page, limit);
    return { orders, totalCount };
  }

}
