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
exports.HashServiceImpl = void 0;
const tsyringe_1 = require("tsyringe");
const bcrypt_1 = __importDefault(require("bcrypt"));
let HashServiceImpl = class HashServiceImpl {
    async hash(password) {
        return await bcrypt_1.default.hash(password, 10);
    }
    async compare(password, hashed) {
        return await bcrypt_1.default.compare(password, hashed);
    }
};
exports.HashServiceImpl = HashServiceImpl;
exports.HashServiceImpl = HashServiceImpl = __decorate([
    (0, tsyringe_1.injectable)()
], HashServiceImpl);
//# sourceMappingURL=HashServiceImpl.js.map