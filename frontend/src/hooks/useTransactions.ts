import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/services/transactionService";
import type { Transaction, TransactionFilters } from "@/types/transaction";

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await transactionService.list(filters);
      setTransactions(data);
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const removeTransaction = async (id: number) => {
    await transactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return { transactions, isLoading, error, refetch: fetchTransactions, removeTransaction };
}
