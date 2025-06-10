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
exports.LoginUser = void 0;
const tsyringe_1 = require("tsyringe");
let LoginUser = class LoginUser {
    constructor(userRepository, hashService, authService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.authService = authService;
    }
    async execute(email, password, userType) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (userType === "provider") {
            if (user.role !== "worker" && user.role !== "provider") {
                const error = new Error("Invalid user type");
                error.status = 403;
                throw error;
            }
        }
        else {
            if (user.role !== userType) {
                const error = new Error("Invalid user type");
                error.status = 403;
                throw error;
            }
        }
        const isMatch = await this.hashService.compare(password, user.password);
        if (!isMatch) {
            console.log("password not mach");
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        const tokens = this.authService.generateTokens(user);
        const { password: _, _id, ...userInfo } = user;
        return { tokens, user: userInfo };
    }
};
exports.LoginUser = LoginUser;
exports.LoginUser = LoginUser = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __param(1, (0, tsyringe_1.inject)("HashService")),
    __param(2, (0, tsyringe_1.inject)("AuthService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], LoginUser);
//# sourceMappingURL=LoginUser.js.map