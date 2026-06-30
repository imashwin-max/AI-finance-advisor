export interface Transaction {
  id: number;
  date: string;
  description: string;
  merchant: string | null;
  category: string;
  debit: number;
  credit: number;
  balance: number | null;
  is_recurring: boolean;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  category?: string;
  merchant?: string;
  min_amount?: number;
  max_amount?: number;
  transaction_type?: "income" | "expense";
  keyword?: string;
}

export const CATEGORIES = [
  "Food", "Shopping", "Travel", "Bills", "Healthcare",
  "Entertainment", "Education", "Investment", "Salary",
  "Transfer", "Miscellaneous",
] as const;

export type Category = typeof CATEGORIES[number];
