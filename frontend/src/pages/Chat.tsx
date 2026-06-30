import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export function Chat() {
  const { messages, sendMessage, isSending, suggestedPrompts } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AppLayout title="AI Financial Advisor">
      <div className="flex h-[calc(100vh-9rem)] flex-col rounded-2xl border border-border bg-surface/40 backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Ask your AI financial advisor</h2>
                <p className="mt-1 text-sm text-muted">Grounded in your real transaction data — try a prompt below.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-border bg-surfaceHover px-3.5 py-2 text-xs text-white/80 hover:border-primary/50 hover:text-white transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <ChatInput onSend={sendMessage} disabled={isSending} />
        </div>
      </div>
    </AppLayout>
  );
}
