import { ClientStakeholder } from "@/types/stakeholder.types";

export interface IClientStakeholderRepository {
  getAll(params?: {
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
  }>;

  create(data: Partial<ClientStakeholder>): Promise<ClientStakeholder>;
  update(id: string, data: Partial<ClientStakeholder>): Promise<ClientStakeholder>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<ClientStakeholder>;
  // toggleFavorite(id: string): Promise<Note>;
}
