
import { UserRepository } from "../../domain/repositories/UserRepository";

export class ViewCustomer {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const customer = await this.userRepository.findCustomerById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }
}
