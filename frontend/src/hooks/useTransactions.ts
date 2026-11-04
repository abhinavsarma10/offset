import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaction } from "@/types/transaction";

interface DatabaseTransaction {
  id: string;
  description: string;
  amount_cents: number;
  category: Transaction["category"];
  transaction_date: string;
  created_by: string;
  notes: string | null;
  profiles: {
    display_name: string;
  } | null;
}

function mapTransaction(row: DatabaseTransaction): Transaction {
  return {
    id: row.id,
    description: row.description,
    amountCents: row.amount_cents,
    category: row.category,
    transactionDate: row.transaction_date,
    createdBy: row.profiles?.display_name ?? "Offset member",
    notes: row.notes ?? undefined,
  };
}

export function useTransactions(spaceId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestId = useRef(0);

  const fetchTransactions = useCallback(async () => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        profiles:profiles!transactions_created_by_profiles_fkey (
        display_name
      )
      `,
      )
      .eq("space_id", spaceId)
      .order("transaction_date", { ascending: false });

    if (currentRequest !== requestId.current) return;

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setTransactions(
      (data ?? []).map((row) =>
        mapTransaction(row as unknown as DatabaseTransaction),
      ),
    );
    setLoading(false);
  }, [spaceId]);

  useEffect(() => {
    fetchTransactions();

    return () => {
      requestId.current += 1;
    };
  }, [fetchTransactions]);

  async function addTransaction(transaction: Transaction) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("You must be signed in.");

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        space_id: spaceId,
        description: transaction.description,
        amount_cents: transaction.amountCents,
        category: transaction.category,
        transaction_date: transaction.transactionDate,
        created_by: user.id,
        notes: transaction.notes ?? null,
      })
      .select(
        `
        *,
        profiles:profiles!transactions_created_by_profiles_fkey (
        display_name
      )
      `,
      )
      .single();

    if (error) throw error;

    setTransactions((current) => [
      mapTransaction(data as unknown as DatabaseTransaction),
      ...current,
    ]);
  }

  async function updateTransaction(transaction: Transaction) {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        description: transaction.description,
        amount_cents: transaction.amountCents,
        category: transaction.category,
        transaction_date: transaction.transactionDate,
        notes: transaction.notes ?? null,
      })
      .eq("id", transaction.id)
      .eq("space_id", spaceId)
      .select(
        `
        *,
        profiles:profiles!transactions_created_by_profiles_fkey (
        display_name
      )
      `,
      )
      .single();

    if (error) throw error;

    setTransactions((current) =>
      current.map((item) =>
        item.id === transaction.id
          ? mapTransaction(data as unknown as DatabaseTransaction)
          : item,
      ),
    );
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("space_id", spaceId);

    if (error) throw error;

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id),
    );
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };
}
