import { Config } from "@/types/config.types";

export interface IConfigService {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
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
    change_summary?: string;
  }): Promise<Config>;

  update(
    id: string,
    data: Partial<Config>
  ): Promise<Config>;

  delete(id: string): Promise<void>;

  getById(id: string): Promise<Config>;
}
