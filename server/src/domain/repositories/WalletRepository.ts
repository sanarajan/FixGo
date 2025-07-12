import { Wallet } from "../models/Wallet";

export interface WalletRepository {
  createWallet(userId: string): Promise<Wallet>;
}
