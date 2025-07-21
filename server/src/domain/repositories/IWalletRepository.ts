import { Wallet } from "../models/Wallet";
export interface CreditToWalletDTO {
  userId: string;
  amount: number;
  transactionType: "credit" | "debit" | "referral" | "purchase" | "refund";
}
export interface IWalletRepository {
  createWallet(userId: string): Promise<Wallet>;
   creditToWallet(data: CreditToWalletDTO): Promise<void>;
     getWalletByUserId(userId: string): Promise<{ balance: number; withdrawable: number }>;
getTransactions(customerId: string, page: number, limit: number): Promise<{
    data: any[];
    totalPages: number;
    currentPage: number;
  }>;
}
