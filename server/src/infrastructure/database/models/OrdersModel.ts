import mongoose, { Schema, Document, Types } from "mongoose";
import { Iaddresses } from "../../../domain/models/Iaddresses";
import { time, timeStamp } from "console";
import { IOrder } from "../../../domain/models/IOrder";


const OrdersSchema: Schema = new Schema(
  {
    workerId: { type: String, ref: "User", required: true },
    customerId: { type: Types.ObjectId, ref: "User", required: true },
    providerId: { type: Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Types.ObjectId, ref: "Service", required: true },
    subcategoryId: { type: Types.ObjectId, ref: "SubCategory", required: true },
    cartId: { type: Types.ObjectId, ref: "Cart" }, // if used
    paymentStatus: {
      type: String,
      enum: ["Pending","advance paid", "Cancelled","Paid", "Refunded","Failed"],
      default: "Pending",
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Upcoming", "Ongoing", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentIntentId: { type: String, default: "" }, // Stripe payment intent ID
    amount: {
      total: { type: Number, required: true },
      advancePaid: { type: Number, default: 0 },
      invoiceAmount: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      remaining: { type: Number, default: 0 },
      offertYype: {
        type: String,
      },
      offertValue: { type: Number, default: 0 },
      refferralCode: { type: String, default: ""}
    },
    slot: {
      date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "10:00 AM"
    },
    bookingAddress: { type: String, required: true },
    cancellation: {
      allowedTill: { type: Date, required: true }, 
      refunded: { type: Boolean, default: false },
      refundAmount: { type: Number, default: 0 },
      refundTo: {
        type: String,
        enum: ["customer", "provider"],
        default: "customer",
      },
      split: {
        admin: { type: Number, default: 0 },
        provider: { type: Number, default: 0 },
      },
    },
    statusHistory: [
      {
        status: { type: String },//booking status history
        at: { type: Date, default: Date.now },
        reason: { type: String, default: "" }, // Optional reason for status change
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    status: { type: String, default: "Active" },
    current: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: Types.ObjectId, required: true, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

OrdersSchema.index({ geoLocation: "2dsphere" });

const OrdersModel = mongoose.model<IOrder & Document>("Orders", OrdersSchema);

export { OrdersModel };
