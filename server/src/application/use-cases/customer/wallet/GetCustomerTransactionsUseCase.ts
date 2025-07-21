import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositories/IWalletRepository";

@injectable()
export class GetCustomerTransactionsUseCase {
  constructor(
    @inject("IWalletRepository") private walletRepo: IWalletRepository
  ) {}

  async execute(customerId: string, page: number, limit: number) {
    return await this.walletRepo.getTransactions(customerId, page, limit);
  }
}
