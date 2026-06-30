import { useState } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/types/transaction";
import type { TransactionFilters } from "@/types/transaction";

export function FilterBar({ onApply }: { onApply: (filters: TransactionFilters) => void }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"" | "income" | "expense">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const apply = () => {
    onApply({
      keyword: keyword || undefined,
      category: category || undefined,
      transaction_type: type || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    });
  };

  const clear = () => {
    setKeyword(""); setCategory(""); setType(""); setStartDate(""); setEndDate("");
    onApply({});
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface/80 p-4">
      <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Search merchant, description, amount…"
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted"
        />
      </div>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none">
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={type} onChange={(e) => setType(e.target.value as "" | "income" | "expense")} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none">
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none" />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-white outline-none" />

      <button onClick={apply} className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-white">Apply</button>
      <button onClick={clear} className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm text-muted hover:text-white">
        <X className="h-3.5 w-3.5" /> Clear
      </button>
    </div>
  );
}
