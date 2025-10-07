import { Config } from "@/types/config.types";

export interface IConfigRepository {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    projectId?: string;
    version?: number;
    is_latest?: boolean;
    // created_by?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Config[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  create(data: {
    projectId?: string;
    config: Partial<Config["config"]>;
    version: number;
    is_latest: boolean;
    isDeleted?: boolean;
    // created_by?: Config["created_by"];
    // updated_by?: Config["updated_by"];
    change_summary?: string;
  }): Promise<Config>;

  update(id: string, data: Partial<Config>): Promise<Config>;

  delete(id: string): Promise<void>; // soft delete

  getById(id: string): Promise<Config>;
}
