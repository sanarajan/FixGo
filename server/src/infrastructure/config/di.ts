import { container } from "tsyringe";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRepositoryImpl } from "../../infrastructure/database/repositories/UserRepositoryImpl";
import { HashService } from "../../application/services/HashService";
import { HashServiceImpl } from "../../infrastructure/services/HashServiceImpl";
import { AuthService } from "../../application/services/AuthService";
import { AuthServiceImpl } from "../../infrastructure/services/AuthServiceImpl";
import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUsecase";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { CustomerRepositoryImpl } from "../../infrastructure/database/repositories/CustomerRepositoryImpl";
import { OtpService } from "../../application/services/OtpService";
import { OtpServiceImpl } from "../../infrastructure/services/OtpServiceImpl";
import { EmailService } from "../../application/services/EmailService";
import { EmailServiceImpl } from "../../infrastructure/services/EmailServiceImpl";
import { GoogleAuthService } from '../../domain/services/GoogleAuthService'; // <- domain interface
import { GoogleAuthServiceImpl } from '../services/GoogleAuthServiceImpl'; // <- implementation
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ServiceRepositoryImpl } from "../../infrastructure/database/repositories/ServiceRepositoryImpl";
import { IproviderServicesRepositoryImpl } from "../../infrastructure/database/repositories/IproviderServicesRepositoryImpl";
import { IproviderServicesRepository } from "../../domain/repositories/provider/IproviderServicesRepository";
//stripe
import { IPaymentService } from '../../domain/services/IPaymentService';
import { StripePaymentService } from '../../infrastructure/services/StripePaymentServices';
import {IOrderRepositoryImpl} from "../../infrastructure/database/repositories/IOrderRepositoryImpl"
import {IOrderRepository} from "../../domain/repositories/customer/IOrderRepository"
// Register interfaces to concrete implementations
container.register<UserRepository>("UserRepository", {
    useClass: UserRepositoryImpl,
  });
  container.register<HashService>("HashService", {
    useClass: HashServiceImpl,
  });
  container.register<AuthService>("AuthService", {
    useClass: AuthServiceImpl,
  });
  container.register("RefreshTokenUseCase", { useClass: RefreshTokenUseCase });

  container.register<ICustomerRepository>("CustomerRepository", {
    useClass: CustomerRepositoryImpl,
  });
  
  container.register<OtpService>('OtpService', {
    useClass: OtpServiceImpl,
  });
  container.register<EmailService>("EmailService", {
     useClass: EmailServiceImpl,
  });

  container.register<GoogleAuthService>('GoogleAuthService', {
      useClass: GoogleAuthServiceImpl,
  });
  
 
  container.register<IServiceRepository>('IServiceRepository', {
    useClass: ServiceRepositoryImpl,
});
container.register<IproviderServicesRepository>('IproviderServicesRepository', {
  useClass: IproviderServicesRepositoryImpl,
});

container.register<IPaymentService>('IPaymentService', {
  useClass: StripePaymentService,
});
container.register<IOrderRepository>('IOrderRepository', {
  useClass: IOrderRepositoryImpl,
});