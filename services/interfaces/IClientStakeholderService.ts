import { ClientStakeholder } from "@/types/stakeholder.types";

export interface IClientStakeholderService {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
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
