// src/infrastructure/repositories/UserRepositoryImpl.ts
import { IOrder } from "../../../domain/models/IOrder";
import { IOrderRepository } from "../../../domain/repositories/customer/IOrderRepository";
import { User } from "../../../domain/models/User";
import { OrdersModel } from "../models/OrdersModel";
import { injectable } from "tsyringe";

import mongoose, { Types } from "mongoose";

@injectable()
export class IOrderRepositoryImpl implements IOrderRepository {
  async saveOrder(savingOrder?: IOrder): Promise<IOrder> {
    const savedOrder = await OrdersModel.create(savingOrder);

    return savedOrder;
  }

  async providerOrderList(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{ orders: IOrder[]; totalCount: number }> {
    const skip = (page - 1) * limit;
const query = {
  providerId: providerId, // if only provider bookings
};
  const orders = await OrdersModel.find(query)
  .populate('serviceId', 'serviceName')
  .populate('subcategoryId', 'subcategory')
  .populate('providerId', 'fullname email phone')
  .populate('customerId', 'fullname email phone image as custImage')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

const totalCount = await OrdersModel.countDocuments(query);

  

    return { orders, totalCount };
  }
}
