import { injectable, inject } from "tsyringe";
import { IproviderServicesRepository } from "../../../../../domain/repositories/provider/IproviderServicesRepository";
import { IproviderServices } from "../../../../../domain/models/IproviderServices";
import { tokenUserData } from "../../../../../domain/models/Iservices";
import { User } from "../../../../../domain/models/User";
import { UserRepository } from "../../../../../domain/repositories/UserRepository";
import { HashService } from "../../../../services/HashService";
@injectable()
export class AddStaffUsecase {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("HashService") private hashService: HashService,
    @inject("IproviderServicesRepository")
    private staffServiceRepo: IproviderServicesRepository
  ) {}
  public async execute(user: User, services: IproviderServices[]): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(user.email);
    if (existingEmail) throw Object.assign(new Error("Email already exists"), { status: 400 });
    const existingUsername = await this.userRepository.findByUsername?.(user.username ?? undefined);
    if (existingUsername) throw Object.assign(new Error("Username already exists"), { status: 400 });
    const existingPhone = await this.userRepository.findByPhone?.(user.phone ?? undefined);
    if (existingPhone) throw Object.assign(new Error("Phone number already exists"), { status: 400 });
    // Hash password
    user.password = await this.hashService.hash(user.password);
    // Create user
    const createdUser = await this.userRepository.create(user);
console.log(services+" services for save")
    if (services && services.length > 0) {
      const serviceData = services.map(service => ({
        ...service,
        createdBy: createdUser._id as any,
      }));
      await this.staffServiceRepo.addMultipleStaffServices(serviceData);
    }
    return createdUser;
  }
}
