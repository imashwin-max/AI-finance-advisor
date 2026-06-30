import api from "./api";
import type { Summary, Analytics, HealthScore } from "@/types/analytics";

export const analyticsService = {
  async getSummary(): Promise<Summary> {
    const { data } = await api.get<Summary>("/summary");
    return data;
  },
  async getAnalytics(): Promise<Analytics> {
    const { data } = await api.get<Analytics>("/analytics");
    return data;
  },
  async getHealthScore(): Promise<HealthScore> {
    const { data } = await api.get<HealthScore>("/health-score");
    return data;
  },
};
