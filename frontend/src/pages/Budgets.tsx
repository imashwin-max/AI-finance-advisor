import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { useBudgets } from "@/hooks/useBudgets";
import { useToast } from "@/components/ui/Toast";
import { CATEGORIES } from "@/types/transaction";

export function Budgets() {
  const { budgets, isLoading, createBudget } = useBudgets();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [limit, setLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!limit || Number(limit) <= 0) {
      showToast("Enter a valid budget amount.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await createBudget({ category, month, limit_amount: Number(limit) });
      showToast("Budget created.", "success");
      setShowForm(false);
      setLimit("");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      showToast(message || "Failed to create budget.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="Budget Planner">
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" /> New Budget
          </button>
        </div>

        {showForm && (
          <Card className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Month</label>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted">Limit Amount (₹)</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="10000"
                className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save Budget"}
            </button>
          </Card>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} className="h-32" />)}
          </div>
        ) : budgets.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-muted py-6">No budgets set yet — create one to start tracking spending limits.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => <BudgetCard key={b.id} budget={b} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
