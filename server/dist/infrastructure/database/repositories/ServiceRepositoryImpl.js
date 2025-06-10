"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRepositoryImpl = void 0;
// data/repositories/ServiceRepositoryImpl.ts
const tsyringe_1 = require("tsyringe");
// import { IService } from "../../../domain/models/Iservices";
const ServiceModel_1 = require("../models/ServiceModel");
const SubcategoryModel_1 = require("../models/SubcategoryModel");
// export type CreateSubcategoryInput = Pick<IServiceSubcategories, 'serviceId'|'subcategoryNam' | 'status' | 'createdBy'>;
let ServiceRepositoryImpl = class ServiceRepositoryImpl {
    async listServices(page = 1, limit = 3) {
        const skip = (page - 1) * limit;
        const services = await ServiceModel_1.ServiceModel.find().skip(skip)
            .limit(limit).lean();
        return services;
    }
    async addService(data) {
        const createService = await ServiceModel_1.ServiceModel.create(data);
        const { _id, ...rest } = createService.toObject();
        return createService;
    }
    async isExistService(serviceName, id) {
        serviceName = serviceName.toLocaleUpperCase();
        const filter = { serviceName };
        // when an id is supplied, exclude that document
        if (id)
            filter._id = { $ne: id };
        console.log("Filter used for checking service existence:", JSON.stringify(filter, null, 2));
        const doc = await ServiceModel_1.ServiceModel.findOne(filter).lean();
        console.log(doc + "result");
        return !!doc;
    }
    async editService(id, data) {
        const updated = await ServiceModel_1.ServiceModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update service");
        }
        return updated;
    }
    async serviceFindById(id) {
        if (!id)
            return null;
        return ServiceModel_1.ServiceModel.findById(id).lean();
    }
    async findAndDeleteService(id) {
        const deleted = await ServiceModel_1.ServiceModel.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new Error("Failed to delete service");
        }
        return deleted;
    }
    async changeStatusById(id, status, admin) {
        const data = {
            "status": status,
            "updatedBy": admin
        };
        const updated = await ServiceModel_1.ServiceModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update service");
        }
        return updated ? true : false;
    }
    //subcategories services
    async serviceSubcategories(page = 1, limit = 3) {
        const skip = (page - 1) * limit;
        const services = await SubcategoryModel_1.SubcategoryModel.find()
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({
            path: 'serviceId',
            select: 'serviceName status'
        })
            .exec();
        return services;
    }
    async isExistServicesubCategory(subcategoryName, serviceId, id) {
        const subcategory = subcategoryName.toLocaleUpperCase();
        const filter = { subcategory, serviceId };
        if (id)
            filter._id = { $ne: id };
        const doc = await SubcategoryModel_1.SubcategoryModel.findOne(filter).lean();
        return !!doc;
    }
    async addSubcategory(data) {
        const createService = await SubcategoryModel_1.SubcategoryModel.create(data);
        const { _id, ...rest } = createService.toObject();
        return createService;
    }
    async subcategoryFindById(id) {
        if (!id)
            return null;
        return SubcategoryModel_1.SubcategoryModel.findById(id).lean();
    }
    async editSubcategory(id, data) {
        const updated = await SubcategoryModel_1.SubcategoryModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update subcategory");
        }
        return updated;
    }
    async changesubcategoryStatusById(id, status, admin) {
        const data = {
            "status": status,
            "updatedBy": admin
        };
        const updated = await SubcategoryModel_1.SubcategoryModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update service");
        }
        return updated ? true : false;
    }
    async findAndDeleteSubcategory(id) {
        const deleted = await SubcategoryModel_1.SubcategoryModel.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new Error("Failed to delete subcategory");
        }
        return deleted;
    }
};
exports.ServiceRepositoryImpl = ServiceRepositoryImpl;
exports.ServiceRepositoryImpl = ServiceRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)()
], ServiceRepositoryImpl);
//# sourceMappingURL=ServiceRepositoryImpl.js.map