import { inject, injectable } from "tsyringe";
import { IPaymentService } from "../../../../domain/services/IPaymentService";
import {IOrderRepository} from "../../../../domain/repositories/customer/IOrderRepository"
import { IOrder } from "../../../../domain/models/IOrder";
import {generateWorkerId} from "../../../../shared/helpers/IdGeneratorHelper"

@injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    @inject("IPaymentService") private paymentService: IPaymentService,
     @inject("IOrderRepository") private orderRepo: IOrderRepository
  ) {}

  async execute(data: {
    amount: number;
    customerId: string;
    serviceId: string;
    savingOrder: IOrder;
  }): Promise<string> {
        console.log( "  usecase reach")

    data.savingOrder.workerId = generateWorkerId();
    console.log( data.savingOrder.workerId+" WORKERID usecase")
 const saveOrder = await this.orderRepo.saveOrder(data.savingOrder);

    const url = await this.paymentService.createCheckoutSession({
      amount: data.amount,
      customerId: data.customerId,
      serviceId: data.serviceId,
      savingOrderId:saveOrder._id,
    });
    return url;
  }
}
