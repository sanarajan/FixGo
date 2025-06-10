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
exports.EditServiceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let EditServiceUseCase = class EditServiceUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    async execute(admin, id, data) {
        // optional: verify admin role
        const current = await this.repo.serviceFindById(id);
        if (!current) {
            const err = new Error("Service not exist");
            err.status = 404;
            throw err;
        }
        if (data.serviceName) {
            console.log("before checking is exist");
            const nameTaken = await this.repo.isExistService(data.serviceName, id);
            if (nameTaken) {
                console.log(" checking is exist");
                const err = new Error("Service name already exist");
                err.status = 400;
                throw err;
            }
        }
        const updated = await this.repo.editService(id, {
            serviceName: data.serviceName?.toLocaleUpperCase(),
            status: data.status,
            updatedBy: admin.id,
        });
        return updated;
    }
};
exports.EditServiceUseCase = EditServiceUseCase;
exports.EditServiceUseCase = EditServiceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IServiceRepository")),
    __metadata("design:paramtypes", [Object])
], EditServiceUseCase);
//# sourceMappingURL=EditServiceUsecase.js.map