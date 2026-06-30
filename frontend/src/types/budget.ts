export interface Budget {
  id: number;
  category: string;
  month: string;
  limit_amount: number;
  spent: number;
  remaining: number;
  progress_pct: number;
  exceeded: boolean;
}

export interface BudgetCreatePayload {
  category: string;
  month: string;
  limit_amount: number;
}
