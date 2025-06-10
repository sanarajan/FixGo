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
exports.GroupProviderServiceUsecase = void 0;
const tsyringe_1 = require("tsyringe");
let GroupProviderServiceUsecase = class GroupProviderServiceUsecase {
    constructor(repo) {
        this.repo = repo;
    }
    async execute() {
        // optional: verify admin role
        const current = await this.repo.GroupProviderServices();
        if (!current) {
            const err = new Error("Provider services not exist");
            err.status = 404;
            throw err;
        }
        return current;
    }
};
exports.GroupProviderServiceUsecase = GroupProviderServiceUsecase;
exports.GroupProviderServiceUsecase = GroupProviderServiceUsecase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IproviderServicesRepository")),
    __metadata("design:paramtypes", [Object])
], GroupProviderServiceUsecase);
//# sourceMappingURL=GroupProviderServiceUsecase.js.map