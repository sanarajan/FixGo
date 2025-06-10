"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const userSchema = new Schema({
    fullname: { type: String },
    companyName: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, default: "" },
    role: {
        type: String,
        enum: ["admin", "customer", "provider", "worker", "staff"],
        required: true,
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: { type: String, default: 'Inactive' },
    authProvider: { type: String, enum: ['google', 'local'], default: 'local' },
    type: {
        type: String,
        enum: ["provider", "worker", "staff"],
    },
    // isApproved: { type: Boolean, default: false },
    image: { type: String, default: 'noimage.png' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const UserModel = model("User", userSchema);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map