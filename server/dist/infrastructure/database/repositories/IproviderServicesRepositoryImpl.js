"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IproviderServicesRepositoryImpl = void 0;
const tsyringe_1 = require("tsyringe");
const ProviderServicesModel_1 = require("../models/ProviderServicesModel");
let IproviderServicesRepositoryImpl = class IproviderServicesRepositoryImpl {
    async providerServices(page = 1, limit = 3) {
        const skip = (page - 1) * limit;
        const services = await ProviderServicesModel_1.ProviderServicesModel.find().skip(skip)
            .limit(limit).lean().populate({
            path: 'serviceId',
            select: 'serviceName status'
        }).populate({
            path: 'subcategoryId',
            select: 'subcategory status'
        })
            .exec();
        ;
        return services;
    }
    async isExistProviderService(serviceId, subcategory, id) {
        const filter = { subcategoryId: subcategory, serviceId };
        if (id)
            filter._id = { $ne: id };
        const doc = await ProviderServicesModel_1.ProviderServicesModel.findOne(filter).lean();
        return !!doc;
    }
    async addProviderService(data) {
        try {
            const createService = await ProviderServicesModel_1.ProviderServicesModel.create(data);
            return createService;
        }
        catch (err) {
            console.error("❌ Error saving provider service:", err.message);
            throw err;
        }
    }
    async providerServiceFindById(id) {
        if (!id)
            return null;
        return ProviderServicesModel_1.ProviderServicesModel.findById(id).lean();
    }
    async editProviderService(id, data) {
        const updated = await ProviderServicesModel_1.ProviderServicesModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update service");
        }
        return updated;
    }
    async findAndDeleteProviderService(id) {
        const deleted = await ProviderServicesModel_1.ProviderServicesModel.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new Error("Failed to delete service");
        }
        return deleted;
    }
    async changeProServiceStatusById(id, status, admin) {
        const data = {
            "status": status,
            "updatedBy": admin
        };
        const updated = await ProviderServicesModel_1.ProviderServicesModel.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true });
        if (!updated) {
            throw new Error("Failed to update ProviderService");
        }
        return updated ? true : false;
    }
    async GroupProviderServices() {
        try {
            const results = await ProviderServicesModel_1.ProviderServicesModel.aggregate([
                {
                    $lookup: {
                        from: 'services', // collection name
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'serviceDetails',
                    },
                },
                {
                    $unwind: '$serviceDetails',
                },
                {
                    $lookup: {
                        from: 'subcategories',
                        localField: 'subcategoryId',
                        foreignField: '_id',
                        as: 'subcategoryDetails',
                    },
                },
                {
                    $unwind: '$subcategoryDetails',
                },
                {
                    $group: {
                        _id: '$serviceDetails._id',
                        serviceName: { $first: '$serviceDetails.serviceName' },
                        subcategories: {
                            $addToSet: {
                                _id: '$subcategoryDetails._id',
                                name: '$subcategoryDetails.subcategory',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        serviceId: '$_id',
                        serviceName: 1,
                        subcategories: 1
                    },
                },
            ]);
            return results;
        }
        catch (err) {
            console.error("❌ Error saving provider service:", err.message);
            throw err;
        }
    }
};
exports.IproviderServicesRepositoryImpl = IproviderServicesRepositoryImpl;
exports.IproviderServicesRepositoryImpl = IproviderServicesRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)()
], IproviderServicesRepositoryImpl);
//# sourceMappingURL=IproviderServicesRepositoryImpl.js.map