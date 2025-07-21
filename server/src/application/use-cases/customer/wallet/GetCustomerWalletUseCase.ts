import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository";

@injectable()
export class GetCustomerWalletUseCase {
  constructor(
    @inject("IWalletRepository") private walletRepo: IWalletRepository
  ) {}

  async execute(customerId: string) {
    return await this.walletRepo.getWalletByUserId(customerId);
  }
}