"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupedProviderServices = exports.providerServiceBlockUnblock = exports.deleteProviderService = exports.providerUpdateService = exports.providerAddService = exports.adminSubcategoryList = exports.alladminServicesList = exports.providerServices = void 0;
const tsyringe_1 = require("tsyringe");
const ProviderServiceUsecase_1 = require("../../application/use-cases/provider/providerServices/ProviderServiceUsecase");
const AddProviderServiceUsecase_1 = require("../../application/use-cases/provider/providerServices/AddProviderServiceUsecase");
const EditProviderServiceUseCase_1 = require("../../application/use-cases/provider/providerServices/EditProviderServiceUseCase");
const DeleteProviderServiceUsecase_1 = require("../../application/use-cases/provider/providerServices/DeleteProviderServiceUsecase");
const BlockProviderServiceUsecase_1 = require("../../application/use-cases/provider/providerServices/BlockProviderServiceUsecase");
const GroupProviderServiceUsecase_1 = require("../../application/use-cases/provider/providerServices/GroupProviderServiceUsecase");
// import {AddStaffUsecase} from "../../application/use-cases/provider/providerServices/staffs/AddStaffUsecase"
const ProviderServicesModel_1 = require("../../infrastructure/database/models/ProviderServicesModel");
const SubcategoryModel_1 = require("../../infrastructure/database/models/SubcategoryModel");
const ServiceModel_1 = require("../../infrastructure/database/models/ServiceModel");
const providerServices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const listServicesUseCase = tsyringe_1.container.resolve(ProviderServiceUsecase_1.ProviderServiceUsecase);
        const services = await listServicesUseCase.execute(page, limit);
        const totalCount = await ProviderServicesModel_1.ProviderServicesModel.countDocuments();
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
exports.providerServices = providerServices;
const alladminServicesList = async (req, res) => {
    try {
        const allservices = await ServiceModel_1.ServiceModel.find({ status: "Active" }).lean();
        res.status(200).json({ allservices });
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.alladminServicesList = alladminServicesList;
const adminSubcategoryList = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const subcategrories = await SubcategoryModel_1.SubcategoryModel.find({
            status: "Active",
            serviceId,
        }).lean();
        res.status(200).json({ subcategrories });
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.adminSubcategoryList = adminSubcategoryList;
const providerAddService = async (req, res) => {
    try {
        const userAdmin = req.user;
        const data = req.body;
        if (req.file) {
            // data.image = req.file.path; // Save file path or URL
            data.image = req.file.filename;
        }
        const addSubcategoryUseCase = tsyringe_1.container.resolve(AddProviderServiceUsecase_1.AddProviderServiceUsecase);
        const newSubcategory = await addSubcategoryUseCase.execute(userAdmin, data);
        res.status(201).json(newSubcategory);
    }
    catch (err) {
        const error = err;
        console.log(error.message);
        res
            .status(error.status || 400)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.providerAddService = providerAddService;
const providerUpdateService = async (req, res) => {
    try {
        console.log(" reached update");
        const admin = req.user;
        const id = req.params.id;
        const data = req.body;
        if (req.file) {
            data.image = req.file.filename;
        }
        const editUsecase = tsyringe_1.container.resolve(EditProviderServiceUseCase_1.EditProviderServiceUseCase);
        const edit = await editUsecase.execute(admin, id, data);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.providerUpdateService = providerUpdateService;
const deleteProviderService = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const deleteUsecase = tsyringe_1.container.resolve(DeleteProviderServiceUsecase_1.DeleteProviderServiceUsecase);
        const edit = await deleteUsecase.execute(id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.deleteProviderService = deleteProviderService;
const providerServiceBlockUnblock = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const status = req.body.status;
        const blockService = tsyringe_1.container.resolve(BlockProviderServiceUsecase_1.BlockProviderServiceUsecase);
        const edit = await blockService.execute(id, status, admin.id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.providerServiceBlockUnblock = providerServiceBlockUnblock;
const groupedProviderServices = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const servicesFetch = tsyringe_1.container.resolve(GroupProviderServiceUsecase_1.GroupProviderServiceUsecase);
        const services = await servicesFetch.execute();
        res.status(200).json({ services });
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.groupedProviderServices = groupedProviderServices;
// export const addStaff = async (req: Request, res: Response) => {
//   try {
//     const admin = (req as any).user;
//     const id = req.params.id;
//     const data = req.body;
//     if (req.file) {
//       data.image= req.file.filename;
//     }   
//     const { services, ...userData } = data;
//     const serviceList = Array.isArray(services) ? services : [];
//      const dataUsecase = container.resolve(AddStaffUsecase);
//      const addStaffdata = await dataUsecase.execute(userData, serviceList);
//      res.status(200).json(addStaffdata);
//   } catch (err) {
//     const e = err as CustomError;
//     res.status(e.status || 400).json({ error: e.message });
//   }
// };
//# sourceMappingURL=ProviderController.js.map