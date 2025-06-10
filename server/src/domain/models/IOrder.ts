import mongoose, {  Document, Types } from 'mongoose';

export interface IOrderAmount {
  total: number;
  advancePaid: number;
  invoiceAmount: number;
  discount: number;
  remaining: number;
  offertYype?: string;
  offertValue: number;
  refferralCode?: string;
}

export interface IOrderSlot {
  date: Date;
  time: string;
}

export interface IOrderCancellation {
  allowedTill: Date;
  refunded: boolean;
  refundAmount: number;
  refundTo: "customer" | "provider";
  split: {
    admin: number;
    provider: number;
  };
}

export interface IOrderStatusHistory {
  status: string;
  at: Date;
  reason?: string;
}

export interface IOrderGeoLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface IOrder {
  _id?:string | Types.ObjectId;
  workerId?: string; // you set later
  customerId: string;
  providerId: string;
  serviceId: string;
  subcategoryId: string;
  cartId?: string;
  paymentStatus: "advace paid" | "Paid" | "Refunded";
  bookingStatus: "Pending" | "Upcoming" | "Ongoing" | "Cancelled" | "Completed";
  paymentIntentId: string;
  amount: IOrderAmount;
  slot: IOrderSlot;
  bookingAddress: string;
  cancellation: IOrderCancellation;
  statusHistory: IOrderStatusHistory[];
  location: string;
  geoLocation: IOrderGeoLocation;
  longitude: number;
  latitude: number;
  status: string;
  current: boolean;
  createdBy: string;
  updatedBy: string;
}
