export interface IOrder {
  _id: string;
  workerId: string;
  customerId: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    image: string;
  };
  providerId: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    image:string
  };
  serviceId: {
    _id: string;
    serviceName: string;
  };
  subcategoryId: {
    _id: string;
    subcategory: string;
  };
  providerServiceId:{
    image :string;   
      description:string;
       features:string
  }
  cartId?: string;
  paymentStatus: "Pending" | "advance paid" | "Cancelled" | "Paid" | "Refunded" | "Failed";
  bookingStatus: "Pending" | "Upcoming" | "Ongoing" | "Cancelled" | "Completed";
  paymentIntentId?: string;
  amount: {
    total: number;
    advancePaid: number;
    invoiceAmount: number;
    discount: number;
    remaining: number;
    offertYype?: string;
    offertValue: number;
    refferralCode?: string;
    completePaid?:number
  };
  slot: {
    date: string | Date;
    time: string;
  };
  bookingAddress: string;
  cancellation?: {
    allowedTill: Date;
    refunded: boolean;
    refundAmount: number;
    refundTo: "customer" | "provider";
    split: {
      admin: number;
      provider: number;
    };
  };
  statusHistory?: {
    status: string;
    at: Date;
    reason?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  location: string;
  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  longitude: number;
  latitude: number;
  current: boolean;
  createdBy: string;
  updatedBy?: string;

  // For easier frontend mapping
  date?: string;
  time?: string;
  image?: string;
  price?: number;
  discount?: string;
  status?: string;
  bookingDate?: string;
  payment?: string;
}
