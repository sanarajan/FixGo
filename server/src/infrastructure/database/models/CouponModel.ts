import mongoose, { Schema, Document, Types } from "mongoose";

import {ICoupon} from "../../../domain/models/ICoupon"

const CouponSchema = new Schema<ICoupon>(
  {
    couponName: { type: String, required: true },
    couponImage: { type: String, default: "" },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    minPurchase: { type: Number, required: true },
    discountType: {
      type: String,
      enum: ["percentage", "price"],
      default: "percentage",
    },
    discountPercentage: { type: Number, default: 0 },
    discountValue: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    userUsageLimit: { type: Number, default: 1 },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model<ICoupon>("Coupon", CouponSchema);

export { CouponModel };
