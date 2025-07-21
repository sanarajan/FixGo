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

customerOrderList(
  customerId: string,
  page: number,
  limit: number
): Promise<{ orders: IOrder[]; totalCount: number }>;

 findById(id: string): Promise<IOrder | null>;
  updateById(id: string, update: any): Promise<IOrder | null>;
bookingDetails(
  customerId: string,
bookingId:string
): Promise<{ order: IOrder }>;
  
}

