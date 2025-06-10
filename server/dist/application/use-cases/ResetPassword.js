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
exports.ResetPassword = void 0;
const tsyringe_1 = require("tsyringe");
let ResetPassword = class ResetPassword {
    constructor(userRepo, hashService) {
        this.userRepo = userRepo;
        this.hashService = hashService;
    }
    async execute(password, token) {
        if (!password || !token) {
            throw new Error("Password and user ID are required");
        }
        const forgotClick = await this.userRepo.findForgotClickByToken(token);
        if (!forgotClick) {
            throw new Error("Invalid or expired reset token");
        }
        // ✅ 2. Check if the token is expired
        if (forgotClick.expiresAt < new Date()) {
            throw new Error("Reset token has expired");
        }
        if (forgotClick.clicked === true) {
            throw new Error("Already reset password");
        }
        const hashedPassword = await this.hashService.hash(password);
        const updated = await this.userRepo.updatePasswordById(forgotClick.userId.toString(), hashedPassword);
        const updateClickStatus = await this.userRepo.updateClickedTrue(forgotClick.userId.toString());
        if (!updateClickStatus) {
            throw new Error("Failed to update password");
        }
        return updated;
    }
};
exports.ResetPassword = ResetPassword;
exports.ResetPassword = ResetPassword = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __param(1, (0, tsyringe_1.inject)("HashService")),
    __metadata("design:paramtypes", [Object, Object])
], ResetPassword);
//# sourceMappingURL=ResetPassword.js.map