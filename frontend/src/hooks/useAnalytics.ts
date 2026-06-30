import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";
import type { Summary, Analytics, HealthScore } from "@/types/analytics";

export function useSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getSummary().then(setSummary).finally(() => setIsLoading(false));
  }, []);

  return { summary, isLoading };
}

export function useAnalyticsData() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getAnalytics().then(setAnalytics).finally(() => setIsLoading(false));
  }, []);

  return { analytics, isLoading };
}

export function useHealthScore() {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getHealthScore().then(setHealthScore).finally(() => setIsLoading(false));
  }, []);

  return { healthScore, isLoading };
}
