import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface p-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your spending, budgets, or savings…"
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted max-h-32"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary disabled:opacity-40 shrink-0"
      >
        <Send className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
