import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";
import { IClientRepository } from "../interfaces/IClientRepository";
import { Client } from "@/types/client.types";

export class ClientRepository implements IClientRepository {
  constructor() {}

  async getAllClients(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientCode?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Client[];
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

    if (params?.clientCode) {
      query.append("clientCode", params.clientCode);
    }

    if (params?.deletedStatus) {
      query.append(
        "isDeleted",
        params.deletedStatus === "all" ? "" : params.deletedStatus
      );
    }

    const endpoint = `${API_ENDPOINTS.clients.getAll}?${query.toString()}`;

    return makeApiRequest(endpoint);
  }

  async getClientById(id: string): Promise<Client> {
    return makeApiRequest<Client>(`${API_ENDPOINTS.clients.getById(id)}`);
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    return makeApiRequest<Client>(API_ENDPOINTS.clients.create, {
      method: "POST",
      body: JSON.stringify(client),
    });
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    return makeApiRequest<Client>(`${API_ENDPOINTS.clients.update(id)}`, {
      method: "PUT",
      body: JSON.stringify(client),
    });
  }

  async deleteClient(id: string): Promise<void> {
    await makeApiRequest<void>(`${API_ENDPOINTS.clients.delete(id)}`, {
      method: "DELETE",
    });
  }

  // async toggleFavorite(id: string): Promise<Note> {
  //   return makeApiRequest<Note>(`${API_ENDPOINTS.notes.toggleFavorite(id)}`, {
  //     method: "PATCH",
  //   });
  // }
}
