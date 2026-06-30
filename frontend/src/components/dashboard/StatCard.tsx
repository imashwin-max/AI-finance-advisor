import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, trend, trendPositive, delay }: StatCardProps) {
  return (
    <Card delay={delay} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <span className="text-2xl font-semibold text-foreground tracking-tight">{value}</span>
      {trend && (
        <span className={trendPositive ? "text-xs font-medium text-income" : "text-xs font-medium text-expense"}>
          {trend}
        </span>
      )}
    </Card>
  );
}
