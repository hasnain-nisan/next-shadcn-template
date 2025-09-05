import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IClientStakeholderService } from "../interfaces/IClientStakeholderService";
import { ClientStakeholder } from "@/types/stakeholder.types";
import { IClientStakeholderRepository } from "@/repositories/interfaces/IClientStakeholderRepository";

export class ClientStakeholderService implements IClientStakeholderService {
  private readonly clientStakeholderRepository: IClientStakeholderRepository;

  constructor() {
    this.clientStakeholderRepository = RepositoryFactory.getClientStakeholderRepository();
  }

  async getAll(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientId?: string;
    deletedStatus?: string;
  }): Promise<{
    items: ClientStakeholder[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      return await this.clientStakeholderRepository.getAll(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<ClientStakeholder> {
    try {
      return await this.clientStakeholderRepository.getById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Partial<ClientStakeholder>): Promise<ClientStakeholder> {
    try {
      return await this.clientStakeholderRepository.create(data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<ClientStakeholder>): Promise<ClientStakeholder> {
    try {
      return await this.clientStakeholderRepository.update(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.clientStakeholderRepository.delete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // async toggleFavorite(id: string): Promise<Note> {
  //   try {
  //     return await this.noteRepository.toggleFavorite(id);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unexpected error occurred");
  }
}
