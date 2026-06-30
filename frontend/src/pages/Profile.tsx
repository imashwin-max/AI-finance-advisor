import { User as UserIcon, Mail, LogOut, Database } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { ExportButtons } from "@/components/dashboard/ExportButtons";
import { useAuth } from "@/context/AuthContext";
import { useSummary } from "@/hooks/useAnalytics";

export function Profile() {
  const { user, logout } = useAuth();
  const { summary } = useSummary();

  return (
    <AppLayout title="Profile">
      <div className="flex flex-col gap-5 max-w-2xl">
        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <UserIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user?.full_name || "Demo User"}</h2>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Mail className="h-3.5 w-3.5" /> {user?.email}
            </p>
          </div>
        </Card>

        <Card className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-white">Transaction Data</p>
              <p className="text-xs text-muted">{summary?.transaction_count ?? 0} transactions on record</p>
            </div>
          </div>
          <ExportButtons />
        </Card>

        <Card>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-expense hover:bg-expense/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
