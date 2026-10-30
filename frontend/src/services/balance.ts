import type { Transaction } from "../types/transaction";
import { expense } from "../data/expense";

export function calculateBalance(transactions: Transaction[]) {
  const totalRepaidCents = transactions.reduce(
    (total, transaction) => total + transaction.amountCents,
    0
  );

  const remainingCents = Math.max(
    0,
    expense.originalAmountCents - totalRepaidCents
  );

  const progress = Math.min(
    100,
    (totalRepaidCents / expense.originalAmountCents) * 100
  );

  return {
    originalAmountCents: expense.originalAmountCents,
    totalRepaidCents,
    remainingCents,
    progress,
  };
}