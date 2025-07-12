import mongoose, { Schema, Document, Types } from "mongoose";
import {INotification} from "../../../domain/models/INotification";

const notificationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["staff_rejected", "staff_verified", "booking", "payment"], required: true },
  title: { type: String, required: true },
  sendBy: { type: Types.ObjectId, ref: "User" }, 
  rejectedStaff: { type: Types.ObjectId, ref: "User" },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);
export { NotificationModel };


