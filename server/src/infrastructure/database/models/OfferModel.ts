import mongoose, { Schema, Document, Types } from "mongoose";
import {IOffer} from "../../../domain/models/IOffer"


const OfferSchema: Schema = new Schema(
  {
    
    offerName: {
      type: String,     
      required: true,
    },
    offerFor: {
      type: String,
      enum: ["service", "subcategory"],
      required: true,
    },

    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true
    },
 subcategoryId: {
      type: Types.ObjectId,
      ref: "Subcategories",
     
    },
    providerServiceId: {
      type: Types.ObjectId,
      ref: "ProviderService",
      required: true
    },

    offerType: {
      type: String,
      enum: ["percentage", "price"],
      required: true,
    },

    offerValue: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    description: { type: String },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const OfferModel = mongoose.model<IOffer>("Offer", OfferSchema);
export { OfferModel };
