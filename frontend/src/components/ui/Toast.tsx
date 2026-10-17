import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: string; message: string; type: ToastType }

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = t.type === "success" ? CheckCircle2 : t.type === "error" ? XCircle : Info;
            const color = t.type === "success" ? "text-income" : t.type === "error" ? "text-expense" : "text-accent";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-soft min-w-[260px]"
              >
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-sm text-foreground flex-1">{t.message}</span>
                <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
                  <X className="h-4 w-4 text-muted" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
