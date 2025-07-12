export interface Wallet {
  _id?: string;
  userId: string;
  balance: number;
  history?: {
    transactionType: string;
    amount: number;
    date: Date;
    _id?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
