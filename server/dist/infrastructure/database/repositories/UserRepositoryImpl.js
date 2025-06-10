"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const tsyringe_1 = require("tsyringe");
const UserModel_1 = require("../models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
const ForgotClickModel_1 = require("../models/ForgotClickModel");
let UserRepositoryImpl = class UserRepositoryImpl {
    async create(user) {
        const createdUser = await UserModel_1.UserModel.create(user);
        const { _id, ...rest } = createdUser.toObject();
        return {
            ...rest,
            _id: _id.toString(),
            providerId: createdUser.providerId?.toString() ?? undefined,
        };
    }
    async findByEmail(email) {
        const user = await UserModel_1.UserModel.findOne({ email }).lean();
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async findByUsername(username) {
        const user = await UserModel_1.UserModel.findOne({ username }).lean();
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async findByPhone(phone) {
        const user = await UserModel_1.UserModel.findOne({ phone }).lean();
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async findCustomerById(id) {
        const user = await UserModel_1.UserModel.findOne({ _id: id, role: "customer" }).lean();
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async findByRoleAndId(id, role) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id.trim())) {
            return false;
        }
        const user = await UserModel_1.UserModel.findOne({ _id: id.trim(), role }).lean();
        if (!user)
            return false;
        return true;
    }
    async findProviderById(id) {
        const user = await UserModel_1.UserModel.findOne({
            _id: id,
            $or: [{ role: "provider" }, { role: "worker" }]
        }).lean();
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async emailVerification(email, userType) {
        let user = null;
        if (userType === "provider") {
            user = await UserModel_1.UserModel.findOne({ email, $or: [{ role: "provider" }, { role: "worker" }] }).lean();
        }
        else {
            user = await UserModel_1.UserModel.findOne({ email, role: userType }).lean();
        }
        if (!user)
            return null;
        return {
            ...user,
            _id: user._id.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
    }
    async googleUserTypeCheck(email, userType) {
        const user = await UserModel_1.UserModel.findOne({ email, role: userType }).lean();
        return {
            _id: user?._id?.toString() ?? null,
            isValid: !!user,
            user: user
                ? {
                    ...user,
                    _id: user._id.toString(),
                    providerId: user.providerId?.toString(),
                }
                : null, // make sure 'User | null' is allowed in your type
        };
    }
    async updatePasswordById(id, hashedPassword) {
        await UserModel_1.UserModel.findByIdAndUpdate(id, { password: hashedPassword });
        return true;
    }
    async setForgotPasswordLink(userId, token, expires) {
        const existingRecord = await ForgotClickModel_1.ForgotClickModel.findOne({ userId });
        if (existingRecord) {
            // If the record exists, update it
            existingRecord.token = token;
            existingRecord.expiresAt = expires;
            await existingRecord.save(); // Save the updated record
        }
        else {
            // If the record doesn't exist, create a new one
            const newRecord = new ForgotClickModel_1.ForgotClickModel({
                userId,
                token: token,
                expiresAt: expires,
                clicked: false, // Assuming 'clicked' is false initially
                linkCreatedAt: new Date(),
            });
            await newRecord.save(); // Save the new record
        }
    }
    async findForgotClickByToken(token) {
        const record = await ForgotClickModel_1.ForgotClickModel.findOne({ token }).lean();
        return record;
    }
    async updateClickedTrue(userId) {
        const existingRecord = await ForgotClickModel_1.ForgotClickModel.findOne({ userId });
        if (existingRecord) {
            existingRecord.clicked = true;
            await existingRecord.save();
            return existingRecord;
        }
        return null;
    }
    async changeStatusById(id, status, admin) {
        console.log(status + " data");
        const data = {
            "status": status,
            // "updatedBy":admin
        };
        const updated = await UserModel_1.UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update Provider");
        }
        return updated ? true : false;
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)()
], UserRepositoryImpl);
//# sourceMappingURL=UserRepositoryImpl.js.map