import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { User } from "../../domain/models/User";

@injectable()
export class ListProviders {

  constructor(
    @inject("CustomerRepository")
    private customerRepo: ICustomerRepository
  ) {}

  async execute(page?: number, limit?: number): Promise<User[]> {   

    return this.customerRepo.getAllProviders(page,limit);
  }
}
