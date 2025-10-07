import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IConfigService } from "../interfaces/IConfigService";
import { Config } from "@/types/config.types";
import { IConfigRepository } from "@/repositories/interfaces/IConfigRepository";

export class ConfigService implements IConfigService {
  private readonly configRepository: IConfigRepository;

  constructor() {
    this.configRepository = RepositoryFactory.getConfigRepository();
  }

  async getAll(params?: {
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
  }> {
    try {
      return await this.configRepository.getAll(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Config> {
    try {
      return await this.configRepository.getById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: {
    projectId?: string;
    config: Partial<Config["config"]>;
    change_summary?: string;
    version: number;
    is_latest: boolean;
  }): Promise<Config> {
    try {
      return await this.configRepository.create(data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(
    id: string,
    data: Partial<Config>
  ): Promise<Config> {
    try {
      return await this.configRepository.update(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.configRepository.delete(id);
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
