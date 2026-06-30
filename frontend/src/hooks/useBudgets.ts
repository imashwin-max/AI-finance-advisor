import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services/budgetService";
import type { Budget, BudgetCreatePayload } from "@/types/budget";

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    const data = await budgetService.list();
    setBudgets(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const createBudget = async (payload: BudgetCreatePayload) => {
    const newBudget = await budgetService.create(payload);
    setBudgets((prev) => [...prev, newBudget]);
  };

  return { budgets, isLoading, createBudget, refetch: fetchBudgets };
}
