// src/domain/interfaces/ICustomerRepository.ts
import { User } from "../../models/User";
import { IOrder } from "../../models/IOrder";

export interface IOrderRepository {
  saveOrder(
   
    savingOrder?: IOrder
  ): Promise<IOrder >;
providerOrderList(
  providerId: string,
  page: number,
  limit: number
): Promise<{ orders: IOrder[]; totalCount: number }>;
}
