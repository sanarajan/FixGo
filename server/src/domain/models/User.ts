import { ObjectId } from "mongoose";

export interface User {
  _id?: string | ObjectId;
  fullname?: string|null ;
  companyName?: string | null;
  username?: string|null;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "customer" | "provider" | "worker" | "staff";
  providerId?: string | null|ObjectId;
  status: string;
  authProvider: 'google' | 'local';
  type?: 'staff' | 'worker' | 'provider' | null;

  createdAt?: Date;
  updatedAt?: Date;
  image?:string|null
}
