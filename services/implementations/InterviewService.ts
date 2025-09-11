import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IInterviewService } from "../interfaces/IInterviewService";
import { Interview } from "@/types/interview.types";
import { IInterviewRepository } from "@/repositories/interfaces/IInterviewRepository";

export class InterviewService implements IInterviewService {
  private readonly interviewRepository: IInterviewRepository;

  constructor() {
    this.interviewRepository = RepositoryFactory.getInterviewRepository();
  }

  async getAll(params?: {
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
  }> {
    try {
      return await this.interviewRepository.getAll(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Interview> {
    try {
      return await this.interviewRepository.getById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Partial<Interview>): Promise<Interview> {
    try {
      return await this.interviewRepository.create(data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<Interview>): Promise<Interview> {
    try {
      return await this.interviewRepository.update(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.interviewRepository.delete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unexpected error occurred");
  }
}
