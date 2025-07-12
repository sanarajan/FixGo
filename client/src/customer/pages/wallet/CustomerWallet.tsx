import React, { useEffect, useState } from "react";
import { FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa";
import axiosClient from "../../../api/axiosClient";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";

interface WalletData {
  balance: number;
  withdrawable: number;
}

interface Transaction {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  note: string;
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 20 }).map((_, index) => ({
  _id: `mock-id-${index}`,
  amount: Math.floor(Math.random() * 500) + 100,
  type: index % 2 === 0 ? "credit" : "debit",
  note: index % 2 === 0 ? "Service Completed" : "Withdrawal to Bank",
  date: new Date(Date.now() - index * 86400000).toISOString(),
}));

const CustomerWallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData>({ balance: 2200, withdrawable: 1200 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const transactionsPerPage = 5;

  const fetchWalletData = async () => {
    try {
      const res = await axiosClient.get("/api/provider/wallet");
      setWallet(res.data);
    } catch (err) {
      console.warn("Failed to fetch wallet data. Using mock values.");
    }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      const res = await axiosClient.get(`/api/provider/wallet/transactions?page=${page}&limit=${transactionsPerPage}`);
      setTransactions(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.warn("Using mock transactions due to fetch error.");
      const startIdx = (page - 1) * transactionsPerPage;
      const endIdx = startIdx + transactionsPerPage;
      const paginated = MOCK_TRANSACTIONS.slice(startIdx, endIdx);
      setTransactions(paginated);
      setCurrentPage(page);
      setTotalPages(Math.ceil(MOCK_TRANSACTIONS.length / transactionsPerPage));
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  return (
    <ProviderLayout>
      <div className="p-6 max-w-4xl mx-auto mt-10 space-y-8">

        {/* Wallet Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaWallet className="text-2xl" />
              Wallet Balance
            </h2>
            <p className="text-4xl font-bold mt-2">₹ {wallet.balance.toFixed(2)}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-white/80 mb-1">Withdrawable Amount</p>
            <p className="text-2xl font-semibold">₹ {wallet.withdrawable.toFixed(2)}</p>
            <button
              onClick={() => alert("Withdraw modal to be shown")}
              className="mt-3 bg-white text-indigo-700 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-indigo-100 transition"
            >
              <FaArrowDown className="inline mr-2" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>

          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions found.</p>
          ) : (
            <ul className="divide-y divide-gray-200 text-sm">
              {transactions.map((txn) => (
                <li key={txn._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{txn.note}</p>
                    <p className="text-gray-500 text-xs">{new Date(txn.date).toLocaleString()}</p>
                  </div>
                  <div className={`text-right font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {txn.type === "credit" ? (
                      <span><FaArrowDown className="inline mr-1" /> + ₹{txn.amount.toFixed(2)}</span>
                    ) : (
                      <span><FaArrowUp className="inline mr-1" /> - ₹{txn.amount.toFixed(2)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center mt-4 gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                disabled={currentPage === 1}
                onClick={() => fetchTransactions(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                disabled={currentPage === totalPages}
                onClick={() => fetchTransactions(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ProviderLayout>
  );
};

export default CustomerWallet;
