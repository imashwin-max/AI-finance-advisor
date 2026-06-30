import type { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { CATEGORY_COLORS } from "@/utils/constants";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">No transactions yet — upload a statement to get started.</p>;
  }

  return (
    <div className="divide-y divide-border">
      {transactions.slice(0, 8).map((t) => {
        const isCredit = t.credit > 0;
        return (
          <div key={t.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${CATEGORY_COLORS[t.category] || "#8a8f9c"}22` }}
              >
                {isCredit ? (
                  <ArrowDownLeft className="h-4 w-4 text-income" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-expense" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.merchant || t.description}</p>
                <p className="text-xs text-muted">{t.category} · {formatDate(t.date)}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${isCredit ? "text-income" : "text-expense"}`}>
              {isCredit ? "+" : "-"}{formatCurrency(isCredit ? t.credit : t.debit)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
