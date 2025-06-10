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
exports.AuthServiceImpl = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
let AuthServiceImpl = class AuthServiceImpl {
    generateTokens(user) {
        const payload = { id: user._id, role: user.role };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });
        return { accessToken, refreshToken };
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
    }
    generateForgotToken() {
        return crypto_1.default.randomBytes(32).toString("hex");
    }
};
exports.AuthServiceImpl = AuthServiceImpl;
exports.AuthServiceImpl = AuthServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], AuthServiceImpl);
//# sourceMappingURL=AuthServiceImpl.js.map