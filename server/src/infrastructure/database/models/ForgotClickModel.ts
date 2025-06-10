import mongoose, { Schema, model, Types } from "mongoose";

import {ForgotClick} from "../../../domain/models/ForgotClick"

const ForgotClicksSchema = new Schema<ForgotClick>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },

  expiresAt: { type: Date, required: true },
  clicked: { type: Boolean, default: false },
  linkCreatedAt: { type: Date, default: Date.now },
});

// TTL index to auto-remove expired tokens
ForgotClicksSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const ForgotClickModel = model("ForgotClick", ForgotClicksSchema);

export {ForgotClickModel}
