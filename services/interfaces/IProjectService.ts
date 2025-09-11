import { description } from './../../components/chart-area-interactive';
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

  create(data: {
    name?: string;
    clientTeam?: string;
    clientId?: string;
    // stakeholderIds?: string[];
  }): Promise<Project>;
  update(
    id: string,
    data: {
      name?: string;
      clientTeam?: string;
      clientId?: string;
      // stakeholderIds?: string[];
      description?: string;
    }
  ): Promise<Project>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Project>;
  // toggleFavorite(id: string): Promise<Note>;
}
