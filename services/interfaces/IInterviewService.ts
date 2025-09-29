import { Interview } from "@/types/interview.types";

export interface IInterviewService {
  getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
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

  create(data: {
    name: string;
    date: string;
    gDriveId?: string;
    requestDistillation?: boolean;
    requestCoaching?: boolean;
    requestUserStories?: boolean;
    clientId: string;
    projectId: string;
  }): Promise<Interview>;

  update(
    id: string,
    data: {
      name?: string;
      date?: string;
      gDriveId?: string;
      requestDistillation?: boolean;
      requestCoaching?: boolean;
      requestUserStories?: boolean;
      clientId?: string;
      projectId?: string;
      stakeholderIds?: string[];
    }
  ): Promise<Interview>;

  delete(id: string): Promise<void>;

  getById(id: string): Promise<Interview>;
}
