"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepositoryImpl = void 0;
const UserModel_1 = require("../../../infrastructure/database/models/UserModel");
class CustomerRepositoryImpl {
    async getAllCustomers(page = 1, limit = 3) {
        const skip = (page - 1) * limit;
        const customers = await UserModel_1.UserModel.find({ role: "customer" }).skip(skip)
            .limit(limit).skip(skip)
            .limit(limit).lean();
        return this.mapUsers(customers);
    }
    async getAllProviders(page = 1, limit = 3) {
        const skip = (page - 1) * limit;
        const providers = await UserModel_1.UserModel.find({
            role: { $in: ["provider", "worker"] }
        }).skip(skip)
            .limit(limit).lean();
        return this.mapUsers(providers);
    }
    mapUsers(users) {
        return users.map((user) => ({
            _id: user._id?.toString(),
            fullname: user.fullname ?? undefined,
            companyName: user.companyName ?? undefined,
            username: user.username,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            providerId: user.providerId?.toString() ?? undefined,
            status: user.status,
            authProvider: user.authProvider,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }
}
exports.CustomerRepositoryImpl = CustomerRepositoryImpl;
//# sourceMappingURL=CustomerRepositoryImpl.js.map