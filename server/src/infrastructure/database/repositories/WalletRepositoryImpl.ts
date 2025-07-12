import { injectable } from "tsyringe";
import { WalletRepository } from "../../../domain/repositories/WalletRepository";
import  {WalletModel}  from "../models/WalletModel";
import { Wallet } from "../../../domain/models/Wallet";

@injectable()
export class WalletRepositoryImpl implements WalletRepository {
  async createWallet(userId: string): Promise<Wallet> {
    const wallet = await WalletModel.create({ userId, balance: 0 });
    const { _id, ...rest } = wallet.toObject();

    return {
      ...rest,
      _id: _id.toString(),
      userId: wallet.userId.toString(),
    };
  }
}
