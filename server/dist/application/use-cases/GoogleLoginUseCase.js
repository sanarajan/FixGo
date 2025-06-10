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
exports.GoogleLoginUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GoogleLoginUseCase = class GoogleLoginUseCase {
    constructor(userRepo, googleAuthService, authService) {
        this.userRepo = userRepo;
        this.googleAuthService = googleAuthService;
        this.authService = authService;
    }
    async execute(token, userType) {
        const payload = await this.googleAuthService.verifyToken(token);
        const { email, name, picture } = payload;
        console.log(" yes reaching" + email);
        let user = await this.userRepo.findByEmail(email);
        if (!user) {
            console.log(" user" + user);
            user = await this.userRepo.create({
                fullname: name,
                email,
                username: name,
                phone: "",
                password: "",
                role: userType,
                status: 'Active',
                image: picture,
                authProvider: "google",
                createdAt: new Date(),
            });
            console.log(" user" + user);
        }
        let googleUserTypeCheck = await this.userRepo.googleUserTypeCheck(email, userType);
        if (!googleUserTypeCheck.isValid) {
            const error = new Error(`User is not registered as a ${userType}`);
            error.status = 403;
            throw error;
        }
        const tokens = this.authService.generateTokens(user);
        const { password: _, ...userInfo } = user;
        return { tokens, user: userInfo };
    }
};
exports.GoogleLoginUseCase = GoogleLoginUseCase;
exports.GoogleLoginUseCase = GoogleLoginUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __param(1, (0, tsyringe_1.inject)("GoogleAuthService")),
    __param(2, (0, tsyringe_1.inject)("AuthService")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GoogleLoginUseCase);
//# sourceMappingURL=GoogleLoginUseCase.js.map