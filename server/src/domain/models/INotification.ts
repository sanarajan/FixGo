// src/domain/models/INotification.ts
import { Types } from "mongoose";

export interface INotification {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: "staff_rejected" | "staff_verified" | "booking" | "payment";
  title: string;
  message?: string;
  sendBy?: Types.ObjectId|string; 
  rejectedStaff?: Types.ObjectId|string; 
  isRead: boolean;
  createdAt: Date;
}
