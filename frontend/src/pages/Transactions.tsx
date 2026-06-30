import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { FilterBar } from "@/components/upload/FilterBar";
import { Card } from "@/components/ui/Card";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { CATEGORY_COLORS } from "@/utils/constants";
import type { TransactionFilters } from "@/types/transaction";

export function Transactions() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { transactions, isLoading, removeTransaction } = useTransactions(filters);
  const { showToast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await removeTransaction(id);
      showToast("Transaction deleted.", "success");
    } catch {
      showToast("Failed to delete transaction.", "error");
    }
  };

  return (
    <AppLayout title="Transactions">
      <div className="flex flex-col gap-5">
        <FilterBar onApply={setFilters} />

        <Card className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} className="h-12" />)}
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">No transactions match your filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Balance</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t) => {
                  const isCredit = t.credit > 0;
                  return (
                    <tr key={t.id} className="hover:bg-surfaceHover/50 transition-colors">
                      <td className="px-6 py-3 text-muted whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="px-6 py-3 text-white">
                        <div className="font-medium">{t.merchant || t.description}</div>
                        <div className="text-xs text-muted">{t.description}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: `${CATEGORY_COLORS[t.category] || "#8a8f9c"}22`, color: CATEGORY_COLORS[t.category] || "#8a8f9c" }}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-3 text-right font-semibold whitespace-nowrap ${isCredit ? "text-income" : "text-expense"}`}>
                        {isCredit ? "+" : "-"}{formatCurrency(isCredit ? t.credit : t.debit)}
                      </td>
                      <td className="px-6 py-3 text-right text-muted whitespace-nowrap">
                        {t.balance !== null ? formatCurrency(t.balance) : "—"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => handleDelete(t.id)} className="text-muted hover:text-expense transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
