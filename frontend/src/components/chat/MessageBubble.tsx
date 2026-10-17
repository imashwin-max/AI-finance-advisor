import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import clsx from "clsx";
import type { ChatMessage } from "@/types/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div className={clsx(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isUser ? "bg-primary/20" : "bg-gradient-primary"
      )}>
        {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={clsx(
        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
        isUser ? "bg-primary text-white rounded-tr-sm" : "bg-surface border border-border text-foreground rounded-tl-sm"
      )}>
        {message.content || <span className="inline-flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce" />
        </span>}
      </div>
    </motion.div>
  );
}
