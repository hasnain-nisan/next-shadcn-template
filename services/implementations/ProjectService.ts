import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IProjectService } from "../interfaces/IProjectService";
import { Project } from "@/types/project.types";
import { IProjectRepository } from "@/repositories/interfaces/IProjectRepository";

export class ProjectService implements IProjectService {
  private readonly projectRepository: IProjectRepository;

  constructor() {
    this.projectRepository = RepositoryFactory.getProjectRepository();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
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
  }> {
    try {
      return await this.projectRepository.getAll(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Project> {
    try {
      return await this.projectRepository.getById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Partial<Project>): Promise<Project> {
    try {
      return await this.projectRepository.create(data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    try {
      return await this.projectRepository.update(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.projectRepository.delete(id);
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
