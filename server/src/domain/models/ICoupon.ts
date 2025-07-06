import  {   Types } from 'mongoose';

export interface ICoupon  {
  _id?: string | Types.ObjectId;
  couponName: string;
  couponImage: string; // image(s) as array
  startDate: Date;
  endDate: Date;
  description?: string;
  minPurchase: number;
  discountType: "percentage" | "price";
  discountPercentage: number;
  discountValue: number;
  status: string;
  userUsageLimit: number;
  providerId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}