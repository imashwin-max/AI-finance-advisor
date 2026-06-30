import api from "./api";
import type { Budget, BudgetCreatePayload } from "@/types/budget";

export const budgetService = {
  async list(): Promise<Budget[]> {
    const { data } = await api.get<Budget[]>("/budgets");
    return data;
  },
  async create(payload: BudgetCreatePayload): Promise<Budget> {
    const { data } = await api.post<Budget>("/budgets", payload);
    return data;
  },
};
