import { Client } from "@/types/client.types";

export interface IClientService {
  getAllClients(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
    name?: string;
    clientCode?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Client[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;
  
  createClient(client: Partial<Client>): Promise<Client>;
  updateClient(id: string, client: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  getClientById(id: string): Promise<Client>;
  // toggleFavorite(id: string): Promise<Note>;
}
