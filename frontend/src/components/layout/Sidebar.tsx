import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, BarChart3, Wallet, MessageSquareText, Gauge, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/health-score", label: "Health Score", icon: Gauge },
  { to: "/chat", label: "AI Advisor", icon: MessageSquareText },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl p-5">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary shadow-glow" />
        <span className="text-lg font-semibold text-foreground tracking-tight">FinanceAI</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted hover:bg-surfaceHover hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-expense/10 hover:text-expense transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
