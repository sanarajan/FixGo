import { inject, injectable } from "tsyringe";
import { IOrderRepository } from "../../../../domain/repositories/customer/IOrderRepository";
import { IOrder } from "../../../../domain/models/IOrder";
@injectable()

export class BookingDetailsUsecase {
  constructor(
    @inject("IOrderRepository") private oderRepo: IOrderRepository,
  ) {}


  async execute(
    customerId: string,
 bookingId:string
  ): Promise<{ order: IOrder }> {
    const { order } = await this.oderRepo.bookingDetails(customerId,bookingId);
    return { order };
  }

}
