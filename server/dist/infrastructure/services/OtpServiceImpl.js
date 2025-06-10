"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServiceImpl = void 0;
const tsyringe_1 = require("tsyringe");
const crypto = __importStar(require("crypto"));
const otpModel_1 = __importDefault(require("../../infrastructure/database/models/otpModel"));
let OtpServiceImpl = class OtpServiceImpl {
    async generateAndSaveOtp(email) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 20 * 1000); // expires in 5 minutes
        // Delete existing OTPs for this email (optional)
        await otpModel_1.default.deleteMany({ email });
        await otpModel_1.default.create({ email, otp, expiresAt });
        return otp;
    }
    async validateOtp(email, userOtp) {
        const record = await otpModel_1.default.findOne({ email, otp: userOtp });
        if (!record)
            return false;
        // Valid OTP → delete it after use
        await otpModel_1.default.deleteMany({ email });
        return true;
    }
};
exports.OtpServiceImpl = OtpServiceImpl;
exports.OtpServiceImpl = OtpServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], OtpServiceImpl);
//# sourceMappingURL=OtpServiceImpl.js.map