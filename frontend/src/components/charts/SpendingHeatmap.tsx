import { formatCurrency } from "@/utils/formatters";
import { EmptyChartState } from "./CategoryPieChart";

interface HeatmapEntry { date: string; amount: number }

export function SpendingHeatmap({ data }: { data: HeatmapEntry[] }) {
  if (data.length === 0) {
    return <EmptyChartState message="No spending heatmap data yet." />;
  }

  const max = Math.max(...data.map((d) => d.amount), 1);

  const intensity = (amount: number) => {
    const ratio = amount / max;
    if (ratio === 0) return "bg-surfaceHover";
    if (ratio < 0.25) return "bg-primary/20";
    if (ratio < 0.5) return "bg-primary/45";
    if (ratio < 0.75) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1.5">
      {data.map((d) => (
        <div
          key={d.date}
          title={`${d.date}: ${formatCurrency(d.amount)}`}
          className={`aspect-square rounded-md ${intensity(d.amount)} transition-colors`}
        />
      ))}
    </div>
  );
}
