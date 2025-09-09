import { AnalyticsSnapshot } from "@/types/dashboard.types";

export interface IDashboardService {
  getAnalytics(params?: {
    clientId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<AnalyticsSnapshot>;
}
