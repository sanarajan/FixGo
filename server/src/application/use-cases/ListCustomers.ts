// src/application/use-cases/ListCustomers.ts
import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRepository";
import { User } from "../../domain/models/User";

@injectable()
export class ListCustomers {
  constructor(
    @inject("CustomerRepository")
    private customerRepo: ICustomerRepository
  ) {}

  async execute(): Promise<User[]> {
    return this.customerRepo.getAllCustomers();
  }
}
