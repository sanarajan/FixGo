"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServiceImpl = void 0;
const tsyringe_1 = require("tsyringe");
let OtpServiceImpl = class OtpServiceImpl {
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    }
    validateOtp(expectedOtp, userOtp) {
        return expectedOtp === userOtp; // Compares the expected OTP with the user input
    }
};
exports.OtpServiceImpl = OtpServiceImpl;
exports.OtpServiceImpl = OtpServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], OtpServiceImpl);
//# sourceMappingURL=OtpServiceImpl.js.map