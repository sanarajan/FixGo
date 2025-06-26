// models/Coupon.ts
import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema({
  couponName: { type: String, required: true },
  couponImage: [{ type: String }], // or a single string if only one image
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  minPurchase: { type: Number, required: true },
  discountType: { type: String, enum: ["Percentage", "Fixed"], required: true },
  discountPercentage: { type: Number },
  discountValue: { type: Number },
  status: { type: Boolean, default: true },
  userUsageLimit: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("Coupon", CouponSchema);
