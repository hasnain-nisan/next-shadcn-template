import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AnalyticsSnapshot } from "@/types/dashboard.types";
import { IDashboardService } from "../interfaces/IDashboardService";
import { IDashboardRepository } from "@/repositories/interfaces/IDashboardRepository";

export class DashboardService implements IDashboardService {
  private readonly dashboardRepository: IDashboardRepository;

  constructor() {
    this.dashboardRepository = RepositoryFactory.getDashboardRepository();
  }

  /**
   * Get dashboard analytics.
   * If no filter is provided, returns full system overview.
   * If filter is provided, returns both system and filtered analytics.
   */
  async getAnalytics(params?: {
    clientId?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<AnalyticsSnapshot> {
    try {
      return await this.dashboardRepository.getAnalytics(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unexpected error occurred");
  }
}
