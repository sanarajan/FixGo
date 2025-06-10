// src/domain/interfaces/ICustomerRepository.ts
import { User } from "../../models/User";
import { IOrder } from "../../models/IOrder";

export interface IOrderRepository {
  saveOrder(
   
    savingOrder?: IOrder
  ): Promise<IOrder >;

  
}
