import { Pencil, Trash2, Receipt, ArrowRight } from "lucide-react";
import type { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/services/format";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  title?: string;
  description?: string;
  onViewAll?: () => void;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TransactionList({
  transactions,
  onEdit,
  onDelete,
  title = "Transactions",
  description = "Reimbursement history",
  onViewAll,
}: TransactionListProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>

        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            View all
            <ArrowRight size={15} />
          </button>
        ) : (
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
            {transactions.length} entries
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Receipt size={28} className="mb-3 text-zinc-600" />
          <p className="text-sm text-zinc-400">No transactions yet</p>
          <p className="mt-1 text-xs text-zinc-600">
            Add a transaction to get started.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="group flex items-center justify-between gap-3 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {transaction.description}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>{formatDate(transaction.transactionDate)}</span>
                  <span>·</span>
                  <span>{transaction.category}</span>
                  <span>·</span>
                  <span>{transaction.createdBy}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-emerald-400">
                  {formatCurrency(transaction.amountCents)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit ${transaction.description}`}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${transaction.description}"?`
                        )
                      ) {
                        onDelete(transaction.id);
                      }
                    }}
                    aria-label={`Delete ${transaction.description}`}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TransactionList;