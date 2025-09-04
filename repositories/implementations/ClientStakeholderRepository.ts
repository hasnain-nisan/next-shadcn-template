import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IClientStakeholderRepository } from "../interfaces/IClientStakeholderRepository";
import { ClientStakeholder } from "@/types/stakeholder.types";

export class ClientStakeholderRepository
  implements IClientStakeholderRepository
{
  constructor() {}

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientId?: string;
    deletedStatus?: string;
  }): Promise<{
    items: ClientStakeholder[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const query = new URLSearchParams({
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 10),
    });

    if (params?.sortField) {
      query.append("sortField", params.sortField);
    }

    if (params?.sortOrder) {
      query.append("sortOrder", params.sortOrder);
    }

    if (params?.name) {
      query.append("name", params.name);
    }

    if (params?.clientId) {
      query.append(
        "clientId",
        params.clientId === "all" ? "" : params.clientId
      );
    }

    if (params?.deletedStatus) {
      query.append(
        "isDeleted",
        params.deletedStatus === "all" ? "" : params.deletedStatus
      );
    }

    const endpoint = `${
      API_ENDPOINTS.clientStakeholders.getAll
    }?${query.toString()}`;
    return makeApiRequest(endpoint);
  }

  async getById(id: string): Promise<ClientStakeholder> {
    return makeApiRequest<ClientStakeholder>(
      API_ENDPOINTS.clientStakeholders.getById(id)
    );
  }

  async create(data: Partial<ClientStakeholder>): Promise<ClientStakeholder> {
    const sanitizedData = {
      ...data,
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
    };

    return makeApiRequest<ClientStakeholder>(
      API_ENDPOINTS.clientStakeholders.create,
      {
        method: "POST",
        body: JSON.stringify(sanitizedData),
      }
    );
  }

  async update(
    id: string,
    data: Partial<ClientStakeholder>
  ): Promise<ClientStakeholder> {
    return makeApiRequest<ClientStakeholder>(
      API_ENDPOINTS.clientStakeholders.update(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async delete(id: string): Promise<void> {
    await makeApiRequest<void>(API_ENDPOINTS.clientStakeholders.delete(id), {
      method: "DELETE",
    });
  }

  // async toggleFavorite(id: string): Promise<Note> {
  //   return makeApiRequest<Note>(`${API_ENDPOINTS.notes.toggleFavorite(id)}`, {
  //     method: "PATCH",
  //   });
  // }
}
