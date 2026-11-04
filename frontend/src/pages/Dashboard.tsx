import { useState } from "react";
import { CalendarDays, Plus, Sparkles, LogOut } from "lucide-react";

import Header from "@/components/Header";
import ProgressCard from "@/components/ProgressCard";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import Analytics from "@/components/Analytics";

import { calculateBalance } from "@/services/balance";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/contexts/AuthContext";
import type { Transaction } from "@/types/transaction";
import type { Space } from "@/services/spaces";

type DashboardView = "overview" | "transactions";

interface DashboardProps {
  space: Space;
}

function Dashboard({ space }: DashboardProps) {
  const { signOut } = useAuth();

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(space.id);

  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const balance = calculateBalance(transactions);

  const sortedTransactions = [...transactions].sort((a, b) =>
    b.transactionDate.localeCompare(a.transactionDate),
  );

  const recentTransactions = sortedTransactions.slice(0, 3);

  async function handleSave(transaction: Transaction): Promise<void> {
    if (editingTransaction) {
      await updateTransaction(transaction);
    } else {
      await addTransaction(transaction);
    }
  }

  function handleAdd() {
    setEditingTransaction(null);
    setIsFormOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  function handleClose() {
    setIsFormOpen(false);
    setEditingTransaction(null);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <Header spaceId={space.id} />

        <button
          type="button"
          onClick={signOut}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-400 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      {transactionsLoading && (
        <p className="mt-6 text-sm text-zinc-500">Loading transactions...</p>
      )}

      {transactionsError && (
        <p className="mt-6 text-sm text-red-400">{transactionsError}</p>
      )}

      <nav className="mt-8 flex items-center gap-2 border-b border-white/[0.07] pb-3">
        <button
          type="button"
          onClick={() => setActiveView("overview")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeView === "overview"
              ? "bg-white/10 text-white"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveView("transactions")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeView === "transactions"
              ? "bg-white/10 text-white"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Transactions
        </button>
      </nav>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {activeView === "overview" ? "The Big Picture" : "Activity"}
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {activeView === "overview" ? space.name : "Transactions"}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {activeView === "overview"
              ? "Here's where things stand at the moment."
              : "View and manage your reimbursement history."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeView === "overview" && (
            <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
              <CalendarDays size={14} />
              October 29, 2026
            </div>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            <Plus size={17} />
            Add transaction
          </button>
        </div>
      </div>

      {activeView === "overview" ? (
        <>
          <div className="mt-8">
            <ProgressCard
              originalAmountCents={balance.originalAmountCents}
              totalRepaidCents={balance.totalRepaidCents}
              remainingCents={balance.remainingCents}
              progress={balance.progress}
            />
          </div>

          <div className="mt-5">
            <SummaryCards
              originalAmountCents={balance.originalAmountCents}
              totalRepaidCents={balance.totalRepaidCents}
              remainingCents={balance.remainingCents}
              transactionCount={transactions.length}
            />
          </div>

          <div className="mt-8">
            <Analytics
              transactions={transactions}
              totalRepaidCents={balance.totalRepaidCents}
            />
          </div>

          <div className="mt-8">
            <TransactionList
              transactions={recentTransactions}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
              title="Recent transactions"
              description="Your latest 3 entries"
              onViewAll={() => setActiveView("transactions")}
            />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <TransactionList
            transactions={sortedTransactions}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
            title="All transactions"
            description={`${transactions.length} entries in total`}
          />
        </div>
      )}

      <TransactionForm
        open={isFormOpen}
        onClose={handleClose}
        onSave={handleSave}
        initialTransaction={editingTransaction}
      />

      <div className="mt-10 flex items-center gap-2 border-t border-white/[0.07] pt-6 text-xs text-zinc-500">
        <Sparkles size={14} className="text-emerald-400" />
        <span>Built with blood, sweat, tears and AI</span>
      </div>
    </main>
  );
}

export default Dashboard;
