"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUnblockProvider = exports.providerView = exports.customerView = exports.getAllProviders = exports.getAllCustomers = void 0;
const tsyringe_1 = require("tsyringe");
const ListCustomers_1 = require("../../application/use-cases/ListCustomers");
const ListProviders_1 = require("../../application/use-cases/ListProviders");
const ViewCustomer_1 = require("../../application/use-cases/ViewCustomer");
const ViewProvider_1 = require("../../application/use-cases/ViewProvider");
const UserRepositoryImpl_1 = require("../../infrastructure/database/repositories/UserRepositoryImpl");
const BlockUnblockProviderUseCase_1 = require("../../application/use-cases/admin/lists/BlockUnblockProviderUseCase");
const UserModel_1 = require("../../infrastructure/database/models/UserModel");
const getAllCustomers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const listCustomers = tsyringe_1.container.resolve(ListCustomers_1.ListCustomers);
        const customers = await listCustomers.execute();
        const totalCount = await UserModel_1.UserModel.countDocuments({ role: "customer" });
        const totalPages = Math.ceil(totalCount / limit);
        res
            .status(200)
            .json({ customers, totalPages, totalCount, currentPage: page });
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.getAllCustomers = getAllCustomers;
const getAllProviders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const listProviders = tsyringe_1.container.resolve(ListProviders_1.ListProviders);
        const customers = await listProviders.execute(page, limit);
        const totalCount = await UserModel_1.UserModel.countDocuments({
            role: { $in: ["provider", "worker"] },
        });
        const totalPages = Math.ceil(totalCount / limit);
        res
            .status(200)
            .json({ customers, totalPages, totalCount, currentPage: page });
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.getAllProviders = getAllProviders;
const customerView = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userRepository = new UserRepositoryImpl_1.UserRepositoryImpl();
        const viewCustomerUseCase = new ViewCustomer_1.ViewCustomer(userRepository);
        const customer = await viewCustomerUseCase.execute(id);
        res.status(200).json(customer);
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.customerView = customerView;
const providerView = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userRepository = new UserRepositoryImpl_1.UserRepositoryImpl();
        const viewCustomerUseCase = new ViewProvider_1.ViewProvider(userRepository);
        const customer = await viewCustomerUseCase.execute(id);
        res.status(200).json(customer);
    }
    catch (err) {
        console.error("Error fetching customers:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
};
exports.providerView = providerView;
const blockUnblockProvider = async (req, res) => {
    try {
        const admin = req.user;
        const id = req.params.id;
        const status = req.body.status;
        const blockService = tsyringe_1.container.resolve(BlockUnblockProviderUseCase_1.BlockUnblockProviderUseCase);
        const edit = await blockService.execute(id, status, admin.id);
        res.status(200).json(edit);
    }
    catch (err) {
        const e = err;
        res.status(e.status || 400).json({ error: e.message });
    }
};
exports.blockUnblockProvider = blockUnblockProvider;
//# sourceMappingURL=AdminController.js.map