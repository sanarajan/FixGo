"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const UserRepositoryImpl_1 = require("../../infrastructure/database/repositories/UserRepositoryImpl");
const HashServiceImpl_1 = require("../../infrastructure/services/HashServiceImpl");
const AuthServiceImpl_1 = require("../../infrastructure/services/AuthServiceImpl");
const RefreshTokenUsecase_1 = require("../../application/use-cases/RefreshTokenUsecase");
const CustomerRepositoryImpl_1 = require("../../infrastructure/database/repositories/CustomerRepositoryImpl");
const OtpServiceImpl_1 = require("../../infrastructure/services/OtpServiceImpl");
const EmailServiceImpl_1 = require("../../infrastructure/services/EmailServiceImpl");
const GoogleAuthServiceImpl_1 = require("../services/GoogleAuthServiceImpl"); // <- implementation
const ServiceRepositoryImpl_1 = require("../../infrastructure/database/repositories/ServiceRepositoryImpl");
const IproviderServicesRepositoryImpl_1 = require("../../infrastructure/database/repositories/IproviderServicesRepositoryImpl");
// Register interfaces to concrete implementations
tsyringe_1.container.register("UserRepository", {
    useClass: UserRepositoryImpl_1.UserRepositoryImpl,
});
tsyringe_1.container.register("HashService", {
    useClass: HashServiceImpl_1.HashServiceImpl,
});
tsyringe_1.container.register("AuthService", {
    useClass: AuthServiceImpl_1.AuthServiceImpl,
});
tsyringe_1.container.register("RefreshTokenUseCase", { useClass: RefreshTokenUsecase_1.RefreshTokenUseCase });
tsyringe_1.container.register("CustomerRepository", {
    useClass: CustomerRepositoryImpl_1.CustomerRepositoryImpl,
});
tsyringe_1.container.register('OtpService', {
    useClass: OtpServiceImpl_1.OtpServiceImpl,
});
tsyringe_1.container.register("EmailService", {
    useClass: EmailServiceImpl_1.EmailServiceImpl,
});
tsyringe_1.container.register('GoogleAuthService', {
    useClass: GoogleAuthServiceImpl_1.GoogleAuthServiceImpl,
});
tsyringe_1.container.register('IServiceRepository', {
    useClass: ServiceRepositoryImpl_1.ServiceRepositoryImpl,
});
tsyringe_1.container.register('IproviderServicesRepository', {
    useClass: IproviderServicesRepositoryImpl_1.IproviderServicesRepositoryImpl,
});
//# sourceMappingURL=di.js.map