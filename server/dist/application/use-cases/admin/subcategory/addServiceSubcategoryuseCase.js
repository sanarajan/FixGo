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
exports.addServiceSubcategoryuseCase = void 0;
const tsyringe_1 = require("tsyringe");
let addServiceSubcategoryuseCase = class addServiceSubcategoryuseCase {
    constructor(IserviceRepo) {
        this.IserviceRepo = IserviceRepo;
    }
    async execute(userAdmin, data) {
        const subcategory = data.subcategory.toLocaleUpperCase();
        const isExistService = await this.IserviceRepo.isExistServicesubCategory(subcategory, data.serviceId);
        if (isExistService) {
            const error = new Error("Subcategory already exists");
            error.status = 400;
            throw error;
        }
        const servicedata = {
            serviceId: data.serviceId,
            subcategory: subcategory,
            status: data.status,
            createdBy: userAdmin.id
        };
        const createdService = await this.IserviceRepo.addSubcategory(servicedata);
        if (!createdService) {
            const error = new Error("Subcategory not saved");
            error.status = 400;
            throw error;
        }
        return createdService;
    }
};
exports.addServiceSubcategoryuseCase = addServiceSubcategoryuseCase;
exports.addServiceSubcategoryuseCase = addServiceSubcategoryuseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceRepository")),
    __metadata("design:paramtypes", [Object])
], addServiceSubcategoryuseCase);
//# sourceMappingURL=addServiceSubcategoryuseCase.js.map