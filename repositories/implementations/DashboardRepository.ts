import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { AnalyticsSnapshot } from "@/types/dashboard.types";

export class DashboardRepository implements IDashboardRepository {
  constructor() {}

  async getAnalytics(params?: {
    clientId?: string;
    fromDate?: string | Date;
    toDate?: string | Date;
  }): Promise<AnalyticsSnapshot> {
    const query = new URLSearchParams();

    if (params?.clientId) {
      query.append(
        "clientId",
        params.clientId === "all" ? "" : params.clientId
      );
    }

    if (params?.fromDate) {
      const from = new Date(params.fromDate);
      if (!isNaN(from.getTime())) {
        query.append("from", from.toISOString().split("T")[0]); // YYYY-MM-DD
      }
    }

    if (params?.toDate) {
      const to = new Date(params.toDate);
      if (!isNaN(to.getTime())) {
        query.append("to", to.toISOString().split("T")[0]); // YYYY-MM-DD
      }
    }

    const endpoint = `${API_ENDPOINTS.dashboard.analytics}${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    return makeApiRequest<AnalyticsSnapshot>(endpoint);
  }
}
