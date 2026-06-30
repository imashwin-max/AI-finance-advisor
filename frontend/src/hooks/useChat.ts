import { useState, useCallback } from "react";
import { chatService } from "@/services/chatService";
import type { ChatMessage } from "@/types/chat";

const SUGGESTED_PROMPTS = [
  "Where am I wasting money?",
  "How can I save more?",
  "Summarize this month's spending.",
  "What are my recurring subscriptions?",
  "Suggest a monthly budget.",
  "Can I save ₹10,000 every month?",
];

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content, timestamp: Date.now() };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const { reply } = await chatService.sendMessage(content, history);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply, timestamp: Date.now() }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: "Sorry, something went wrong reaching the AI advisor. Please try again.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsSending(false);
    }
  }, [messages]);

  return { messages, sendMessage, isSending, suggestedPrompts: SUGGESTED_PROMPTS };
}
