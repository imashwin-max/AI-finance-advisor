import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

export function Navbar({ title }: { title: string }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const initials = (user?.full_name || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/60 backdrop-blur-xl px-6 py-4 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-muted hover:bg-surfaceHover hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          aria-pressed={isDark}
          className="rounded-lg p-2 text-muted hover:bg-surfaceHover hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-white shadow-glow">
          {initials}
        </div>
      </div>
    </header>
  );
}
