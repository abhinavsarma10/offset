import { useEffect, useState } from "react";
import { initialTransactions } from "@/data/transactions";
import type { Transaction } from "@/types/transaction";

const STORAGE_KEY = "offset-transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? (JSON.parse(saved) as Transaction[])
        : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(transaction: Transaction) {
    setTransactions((current) => [transaction, ...current]);
  }

  function updateTransaction(updated: Transaction) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === updated.id ? updated : transaction
      )
    );
  }

  function deleteTransaction(id: string) {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  }

  function resetTransactions() {
    setTransactions([...initialTransactions]);
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactions,
  };
}