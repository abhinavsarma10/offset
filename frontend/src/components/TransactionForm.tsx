import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  Transaction,
  TransactionCategory,
} from "@/types/transaction";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  initialTransaction?: Transaction | null;
}

const categories: TransactionCategory[] = [
  "Food & Dining",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Travel",
  "Other",
];

function getTodayDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
}

function TransactionForm({
  open,
  onClose,
  onSave,
  initialTransaction,
}: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<TransactionCategory>("Other");
  const [transactionDate, setTransactionDate] =
    useState(getTodayDate());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDescription(initialTransaction?.description ?? "");
      setAmount(
        initialTransaction
          ? (initialTransaction.amountCents / 100).toFixed(2)
          : ""
      );
      setCategory(initialTransaction?.category ?? "Other");
      setTransactionDate(
        initialTransaction?.transactionDate ?? getTodayDate()
      );
      setNotes(initialTransaction?.notes ?? "");
      setError("");
    }
  }, [open, initialTransaction]);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountInCents = Math.round(Number(amount) * 100);

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      setError("Please enter a valid amount greater than $0.");
      return;
    }

    if (!transactionDate) {
      setError("Please select a transaction date.");
      return;
    }

    const transaction: Transaction = {
      id: initialTransaction?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amountCents: amountInCents,
      category,
      transactionDate,
      createdBy: initialTransaction?.createdBy ?? "You",
      notes: notes.trim() || undefined,
    };

    onSave(transaction);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {initialTransaction ? "Edit transaction" : "Add transaction"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {initialTransaction
                ? "Update the transaction details."
                : "Record a new reimbursement."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Description
            </label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="e.g. Ticket reimbursement"
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Amount (CAD)
            </label>
            <div className="flex items-center rounded-xl border border-white/10 bg-zinc-950 focus-within:border-emerald-500">
              <span className="pl-4 text-sm text-zinc-500">$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Category
              </label>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as TransactionCategory)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Date
              </label>
              <input
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Notes <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              {initialTransaction ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;