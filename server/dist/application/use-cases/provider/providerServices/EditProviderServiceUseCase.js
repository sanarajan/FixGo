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
exports.EditProviderServiceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let EditProviderServiceUseCase = class EditProviderServiceUseCase {
    constructor(providerServiceRepo) {
        this.providerServiceRepo = providerServiceRepo;
    }
    async execute(admin, id, data) {
        // optional: verify admin role
        console.log(data.serviceId + "  serviceid");
        const serviceId = data.serviceId;
        const current = await this.providerServiceRepo.providerServiceFindById(id);
        if (!current) {
            const err = new Error("Provider Service not exist");
            err.status = 404;
            throw err;
        }
        if (data.subcategoryId && data.serviceId) {
            const nameTaken = await this.providerServiceRepo.isExistProviderService(data.serviceId, data.subcategoryId, id);
            if (nameTaken) {
                const err = new Error("Subcategory  already exist");
                err.status = 400;
                throw err;
            }
        }
        const updated = await this.providerServiceRepo.editProviderService(id, {
            serviceId: data.serviceId,
            subcategoryId: data.subcategoryId,
            description: data.description,
            features: data.features,
            status: data.status,
            image: data.image,
            updatedBy: admin.id,
        });
        return updated;
    }
};
exports.EditProviderServiceUseCase = EditProviderServiceUseCase;
exports.EditProviderServiceUseCase = EditProviderServiceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IproviderServicesRepository")),
    __metadata("design:paramtypes", [Object])
], EditProviderServiceUseCase);
//# sourceMappingURL=EditProviderServiceUseCase.js.map