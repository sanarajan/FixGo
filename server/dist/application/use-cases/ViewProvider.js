"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewProvider = void 0;
class ViewProvider {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const provider = await this.userRepository.findProviderById(id);
        if (!provider) {
            throw new Error("Provider not found");
        }
        return provider;
    }
}
exports.ViewProvider = ViewProvider;
//# sourceMappingURL=ViewProvider.js.map