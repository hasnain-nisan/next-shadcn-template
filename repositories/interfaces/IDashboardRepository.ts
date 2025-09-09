import { AnalyticsSnapshot } from "@/types/dashboard.types";

export interface IDashboardRepository {
  getAnalytics(params?: {
    clientId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<AnalyticsSnapshot>;
}