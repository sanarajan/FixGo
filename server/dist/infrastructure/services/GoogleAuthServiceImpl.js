"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthServiceImpl = void 0;
const google_auth_library_1 = require("google-auth-library");
const tsyringe_1 = require("tsyringe");
let GoogleAuthServiceImpl = class GoogleAuthServiceImpl {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async verifyToken(token) {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            throw new Error("Invalid Google token payload");
        }
        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
    }
};
exports.GoogleAuthServiceImpl = GoogleAuthServiceImpl;
exports.GoogleAuthServiceImpl = GoogleAuthServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], GoogleAuthServiceImpl);
//# sourceMappingURL=GoogleAuthServiceImpl.js.map