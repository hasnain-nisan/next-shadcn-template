import { Project } from "@/types/project.types";

export interface IProjectService {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
    name?: string;
    clientTeam?: string;
    clientId?: string;
    stakeholderId?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Project[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  create(data: Partial<Project>): Promise<Project>;
  update(
    id: string,
    data: Partial<Project>
  ): Promise<Project>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Project>;
  // toggleFavorite(id: string): Promise<Note>;
}
