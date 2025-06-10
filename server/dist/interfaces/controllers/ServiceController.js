"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory = exports.subcategoryBlock = exports.editServiceSubcategory = exports.addServiceSubcategory = exports.servicesSubcategories = exports.blockUnblock = exports.deleteService = exports.editService = exports.addService = exports.servicesList = void 0;
const tsyringe_1 = require("tsyringe");
const ListServicesUseCase_1 = require("../../application/use-cases/admin/services/ListServicesUseCase");
const AddServiceUseCase_1 = require("../../application/use-cases/admin/services/AddServiceUseCase");
const EditServiceUsecase_1 = require("../../application/use-cases/admin/services/EditServiceUsecase");
const DeleteServiceUsecase_1 = require("../../application/use-cases/admin/services/DeleteServiceUsecase");
const BlockUnblockServiceUsecase_1 = require("../../application/use-cases/admin/services/BlockUnblockServiceUsecase");
const addServiceSubcategoryuseCase_1 = require("../../application/use-cases/admin/subcategory/addServiceSubcategoryuseCase");
const ServicesSubcategoriesUseCase_1 = require("../../application/use-cases/admin/subcategory/ServicesSubcategoriesUseCase");
const EditSubcategoryUseCase_1 = require("../../application/use-cases/admin/subcategory/EditSubcategoryUseCase");
const BlockUnblockSUbcategoryUsecase_1 = require("../../application/use-cases/admin/subcategory/BlockUnblockSUbcategoryUsecase");
const DeleteSubcategoryUsecase_1 = require("../../application/use-cases/admin/subcategory/DeleteSubcategoryUsecase");
const ServiceModel_1 = require("../../infrastructure/database/models/ServiceModel");
const SubcategoryModel_1 = require("../../infrastructure/database/models/SubcategoryModel");
const servicesList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const listServicesUseCase = tsyringe_1.container.resolve(ListServicesUseCase_1.ListServicesUseCase);
        const services = await listServicesUseCase.execute(page, limit);
        const totalCount = await ServiceModel_1.ServiceModel.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        res
            .status(200)
            .json({ services, totalPages, totalCount, currentPage: page });
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.servicesList = servicesList;
const addService = async (req, res, next) => {
    try {
        const userAdmin = req.user;
        const data = req.body;
        const addServicesuseCase = tsyringe_1.container.resolve(AddServiceUseCase_1.AddServicesuseCase);
        const services = await addServicesuseCase.execute(userAdmin, data);
        res.status(201).json(services);
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 400)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.addService = addService;
const editService = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const data = req.body;
        const editUsecase = tsyringe_1.container.resolve(EditServiceUsecase_1.EditServiceUseCase);
        const edit = await editUsecase.execute(admin, id, data);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.editService = editService;
const deleteService = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const deleteUsecase = tsyringe_1.container.resolve(DeleteServiceUsecase_1.DeleteServiceUsecase);
        const edit = await deleteUsecase.execute(id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.deleteService = deleteService;
const blockUnblock = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const status = req.body.status;
        const blockService = tsyringe_1.container.resolve(BlockUnblockServiceUsecase_1.BlockUnblockServiceUsecase);
        const edit = await blockService.execute(id, status, admin.id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.blockUnblock = blockUnblock;
const servicesSubcategories = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const listServicesUseCase = tsyringe_1.container.resolve(ServicesSubcategoriesUseCase_1.ServicesSubcategoriesUseCase);
        const services = await listServicesUseCase.execute(page, limit);
        const totalCount = await SubcategoryModel_1.SubcategoryModel.countDocuments();
        console.log(totalCount + " tot count");
        const totalPages = Math.ceil(totalCount / limit);
        console.log(totalPages + " tot count");
        res
            .status(200)
            .json({ services, totalPages, totalCount, currentPage: page });
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.servicesSubcategories = servicesSubcategories;
const addServiceSubcategory = async (req, res) => {
    try {
        const userAdmin = req.user;
        const data = req.body;
        const addSubcategoryUseCase = tsyringe_1.container.resolve(addServiceSubcategoryuseCase_1.addServiceSubcategoryuseCase);
        const newSubcategory = await addSubcategoryUseCase.execute(userAdmin, data);
        res.status(201).json(newSubcategory);
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 400)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.addServiceSubcategory = addServiceSubcategory;
const editServiceSubcategory = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const data = req.body;
        console.log(data + "  data");
        const editUsecase = tsyringe_1.container.resolve(EditSubcategoryUseCase_1.EditSubcategoryUseCase);
        const edit = await editUsecase.execute(admin, id, data);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.editServiceSubcategory = editServiceSubcategory;
const subcategoryBlock = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const status = req.body.status;
        const blocksubcate = tsyringe_1.container.resolve(BlockUnblockSUbcategoryUsecase_1.BlockUnblockSubcategoryUsecase);
        const edit = await blocksubcate.execute(id, status, admin.id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.subcategoryBlock = subcategoryBlock;
const deleteSubcategory = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const deleteUsecase = tsyringe_1.container.resolve(DeleteSubcategoryUsecase_1.DeleteSubcategoryUsecase);
        const edit = await deleteUsecase.execute(id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.deleteSubcategory = deleteSubcategory;
//# sourceMappingURL=ServiceController.js.map