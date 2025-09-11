import { Interview } from "@/types/interview.types";

export interface IInterviewRepository {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientId?: string;
    projectId?: string;
    stakeholderId?: string;
    deletedStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: Interview[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  create(data: Partial<Interview>): Promise<Interview>;
  update(id: string, data: Partial<Interview>): Promise<Interview>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Interview>;
}
