export interface Transaction {
  id: string;
  description: string;
  amountCents: number;
  category: TransactionCategory;
  transactionDate: string;
  createdBy: string;
  notes?: string;
}

export type TransactionCategory =
  | "Food & Dining"
  | "Groceries"
  | "Transportation"
  | "Entertainment"
  | "Shopping"
  | "Travel"
  | "Other";
