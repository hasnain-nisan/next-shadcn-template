import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IProjectRepository } from "../interfaces/IProjectRepository";
import { Project } from "@/types/project.types";

export class ProjectRepository implements IProjectRepository {
  constructor() {}

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientId?: string;
    clientTeam?: string;
    stakeholderId?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Project[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams({
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 10),
    });

    if (params?.sortField) query.append("sortField", params.sortField);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
    if (params?.name) query.append("name", params.name);
    if (params?.clientId)
      query.append(
        "clientId",
        params.clientId === "all" ? "" : params.clientId
      );
    if (params?.clientTeam) query.append("clientTeam", params.clientTeam);
    if (params?.stakeholderId)
      query.append("stakeholderId", params.stakeholderId === "all" ? "" : params.stakeholderId);
    if (params?.deletedStatus)
      query.append(
        "isDeleted",
        params.deletedStatus === "all" ? "" : params.deletedStatus
      );

    const endpoint = `${API_ENDPOINTS.projects.getAll}?${query.toString()}`;
    return makeApiRequest(endpoint);
  }

  async getById(id: string): Promise<Project> {
    return makeApiRequest<Project>(API_ENDPOINTS.projects.getById(id));
  }

  async create(data: Partial<Project>): Promise<Project> {
    const sanitizedData = {
      ...data,
      name: data.name?.trim() || undefined,
      clientTeam: data.clientTeam?.trim() || undefined,
    };

    return makeApiRequest<Project>(API_ENDPOINTS.projects.create, {
      method: "POST",
      body: JSON.stringify(sanitizedData),
    });
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return makeApiRequest<Project>(API_ENDPOINTS.projects.update(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    await makeApiRequest<void>(API_ENDPOINTS.projects.delete(id), {
      method: "DELETE",
    });
  }
}
