"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let ForgotPasswordUseCase = class ForgotPasswordUseCase {
    constructor(userRepo, emailService, authService) {
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.authService = authService;
    }
    async execute(email, userType) {
        let googleUserTypeCheck = await this.userRepo.googleUserTypeCheck(email, userType);
        if (!googleUserTypeCheck.isValid) {
            const error = new Error(`Email is not registered as a ${userType}`);
            error.status = 403;
            throw error;
        }
        const token = this.authService.generateForgotToken();
        const expires = new Date(Date.now() + 3600000);
        console.log(googleUserTypeCheck._id + " id check");
        if (googleUserTypeCheck._id) {
            await this.userRepo.setForgotPasswordLink(googleUserTypeCheck._id, token, expires);
        }
        else {
            throw new Error("User ID not found for Google user.");
        }
        const userid = googleUserTypeCheck._id;
        let userPrefix = userType !== "customer" ? userType + "/" : "";
        const link = `${process.env.FRONTEND_URL}${userPrefix}resetPassword/${token}`;
        const result = await this.emailService.sendForgotEmail(email, link);
        return result;
    }
};
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
exports.ForgotPasswordUseCase = ForgotPasswordUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __param(1, (0, tsyringe_1.inject)("EmailService")),
    __param(2, (0, tsyringe_1.inject)("AuthService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], ForgotPasswordUseCase);
//# sourceMappingURL=ForgotPasswordUseCase.js.map