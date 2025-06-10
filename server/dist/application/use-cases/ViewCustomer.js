"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCustomer = void 0;
class ViewCustomer {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const customer = await this.userRepository.findCustomerById(id);
        if (!customer) {
            throw new Error("Customer not found");
        }
        return customer;
    }
}
exports.ViewCustomer = ViewCustomer;
//# sourceMappingURL=ViewCustomer.js.map