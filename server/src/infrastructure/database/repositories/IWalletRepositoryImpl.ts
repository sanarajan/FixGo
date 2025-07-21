import { injectable } from "tsyringe";
import { IWalletRepository,CreditToWalletDTO } from "../../../domain/repositories/IWalletRepository";
import  {WalletModel}  from "../models/WalletModel";
import { Wallet } from "../../../domain/models/Wallet";

@injectable()
export class IWalletRepositoryImpl implements IWalletRepository {
  async createWallet(userId: string): Promise<Wallet> {
    const wallet = await WalletModel.create({ userId, balance: 0 });
    const { _id, ...rest } = wallet.toObject();

    return {
      ...rest,
      _id: _id.toString(),
      userId: wallet.userId.toString(),
    };
  }
  async creditToWallet({ userId, amount, transactionType }: CreditToWalletDTO): Promise<void> {
    const wallet = await WalletModel.findOne({ userId });

    const transaction = {
      transactionType,
      amount,
      date: new Date(),
    };

    if (wallet) {
      await WalletModel.updateOne(
        { userId },
        {
          $inc: { balance: amount },
          $push: { history: transaction },
        }
      );
    } else {
      const newWallet = new WalletModel({
        userId,
        balance: amount,
        history: [transaction],
      });
      await newWallet.save();
    }
  }
   async getWalletByUserId(customerId: string) {
    const wallet = await WalletModel.findOne({ userId:customerId });
    return {
      balance: wallet?.balance || 0,
      withdrawable: wallet?.balance>50?wallet?.balance :0,
    };
  }
 async getTransactions(userId: string, page: number, limit: number) {
  const wallet = await WalletModel.findOne({ userId });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const totalTransactions = wallet.history.length;
  const totalPages = Math.ceil(totalTransactions / limit);
  const skip = (page - 1) * limit;

  // Reverse to get most recent first (assuming latest are at the end)
  const sortedHistory = [...wallet.history].sort((a, b) => {
    return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0);
  });

  const paginated = sortedHistory.slice(skip, skip + limit);

  return {
    data: paginated,
    totalPages,
    currentPage: page,
  };
}

}
