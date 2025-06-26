import  {   Types } from "mongoose";

export interface IOffer {
  _id?:Types.ObjectId|string;
  offerName:string;
  offerFor: "service" | "subcategory";
  serviceId?: Types.ObjectId;
  subcategoryId?:Types.ObjectId;
  providerServiceId?: Types.ObjectId;
  offerType: "percentage" | "price";
  offerValue: number;
  startDate: Date;
  endDate: Date;
  description?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  status?: "Active" | "Inactive";
}