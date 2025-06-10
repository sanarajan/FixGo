// src/infrastructure/repositories/UserRepositoryImpl.ts
import { IOrder } from '../../../domain/models/IOrder';
import {IOrderRepository} from "../../../domain/repositories/customer/IOrderRepository"
import { User } from "../../../domain/models/User";
import { OrdersModel } from"../models/OrdersModel"
import { injectable } from "tsyringe";

import mongoose, { Types } from "mongoose";

    @injectable()
    export class IOrderRepositoryImpl implements IOrderRepository {
  async saveOrder(savingOrder?: IOrder): Promise<IOrder> {
    const savedOrder = await OrdersModel.create(savingOrder);
   
    return savedOrder;
  }

  
}
