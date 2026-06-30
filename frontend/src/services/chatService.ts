import api from "./api";

export const chatService = {
  async sendMessage(message: string, history: { role: string; content: string }[] = []): Promise<{ reply: string }> {
    const { data } = await api.post<{ reply: string }>("/chat", { message, history });
    return data;
  },
};
