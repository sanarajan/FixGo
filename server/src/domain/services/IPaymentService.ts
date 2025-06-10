import { IOrder } from '../models/IOrder';
import mongoose, {  Document, Types } from 'mongoose';

export interface IPaymentService {
  createCheckoutSession(data: {
    amount: number;
    customerId: string;
    serviceId: string;
    savingOrderId?: string|Types.ObjectId; // Optional, can be used for additional order details
  }): Promise<string>; // returns URL
}
