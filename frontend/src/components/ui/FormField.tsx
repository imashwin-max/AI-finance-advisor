import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <input
          ref={ref}
          {...props}
          className={clsx(
            "rounded-xl border bg-background px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted",
            error ? "border-expense" : "border-border focus:border-primary",
            className
          )}
        />
        {error && <span className="text-xs text-expense">{error}</span>}
      </div>
    );
  }
);
FormField.displayName = "FormField";
