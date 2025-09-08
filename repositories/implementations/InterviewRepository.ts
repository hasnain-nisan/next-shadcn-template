import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IInterviewRepository } from "../interfaces/IInterviewRepository";
import { Interview } from "@/types/interview.types";

export class InterviewRepository implements IInterviewRepository {
  constructor() {}

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientId?: string;
    projectId?: string;
    deletedStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: Interview[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    // Build query parameters manually to avoid over-encoding dates
    const queryParts: string[] = [
      `page=${params?.page ?? 1}`,
      `limit=${params?.limit ?? 10}`,
    ];

    if (params?.sortField) {
      queryParts.push(`sortField=${encodeURIComponent(params.sortField)}`);
    }
    if (params?.sortOrder) {
      queryParts.push(`sortOrder=${params.sortOrder}`);
    }
    if (params?.name) {
      queryParts.push(`name=${encodeURIComponent(params.name)}`);
    }
    if (params?.clientId) {
      const clientIdValue = params.clientId === "all" ? "" : params.clientId;
      queryParts.push(`clientId=${encodeURIComponent(clientIdValue)}`);
    }
    if (params?.projectId) {
      const projectIdValue = params.projectId === "all" ? "" : params.projectId;
      queryParts.push(`projectId=${encodeURIComponent(projectIdValue)}`);
    }
    if (params?.deletedStatus) {
      const deletedStatusValue =
        params.deletedStatus === "all" ? "" : params.deletedStatus;
      queryParts.push(`isDeleted=${encodeURIComponent(deletedStatusValue)}`);
    }

    // For dates, don't encode them if your backend expects ISO format
    if (params?.startDate) {
      queryParts.push(`startDate=${params.startDate}`);
    }
    if (params?.endDate) {
      queryParts.push(`endDate=${params.endDate}`);
    }

    const queryString = queryParts.join("&");
    const endpoint = `${API_ENDPOINTS.interviews.getAll}?${queryString}`;

    return makeApiRequest(endpoint);
  }

  async getById(id: string): Promise<Interview> {
    return makeApiRequest<Interview>(API_ENDPOINTS.interviews.getById(id));
  }

  async create(data: Partial<Interview>): Promise<Interview> {
    const sanitizedData = {
      ...data,
      name: data.name?.trim() || undefined,
      gDriveId: data.gDriveId?.trim() || undefined,
      requestDistillation: data.requestDistillation?.trim() || undefined,
      requestCoaching: data.requestCoaching?.trim() || undefined,
      requestUserStories: data.requestUserStories?.trim() || undefined,
    };

    return makeApiRequest<Interview>(API_ENDPOINTS.interviews.create, {
      method: "POST",
      body: JSON.stringify(sanitizedData),
    });
  }

  async update(id: string, data: Partial<Interview>): Promise<Interview> {
    return makeApiRequest<Interview>(API_ENDPOINTS.interviews.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    await makeApiRequest<void>(API_ENDPOINTS.interviews.delete(id), {
      method: "DELETE",
    });
  }
}
