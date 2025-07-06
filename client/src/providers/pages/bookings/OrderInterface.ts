
export interface IOrderAmount {
  total: number;
  advancePaid: number;
  invoiceAmount: number;
  discount: number;
  remaining: number;
  offerType?: "percentage" | "flat";
  offerValue: number;
  discountName?: string;
  discountSource?: string;
  referralCode?: string;
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
//extra 
export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  image?: string;
}
export interface IService {
  _id: string;
  serviceName: string;
}

export interface ISubcategory {
  _id: string;
  subcategory: string;
}

export interface IProviderService {
  _id: string;
  description: string;
  features: string;
  image?: string;
}

export interface IOrder {
  _id: string;
  workerId?: string;

  customerId: IUser;
  providerId: IUser;
  serviceId: IService;
  subcategoryId: ISubcategory;
  providerServiceId?: IProviderService;

  cartId?: string;
  paymentStatus: "advance paid" | "Paid" | "Refunded";
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
  createdAt: string;
  updatedAt: string;
}
