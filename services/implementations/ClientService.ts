import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IClientService } from "../interfaces/IClientService";
import { Client } from "@/types/client.types";
import { IClientRepository } from "@/repositories/interfaces/IClientRepository";

export class ClientService implements IClientService {
  private readonly clientRepository: IClientRepository;

  constructor() {
    this.clientRepository = RepositoryFactory.getClientRepository();
  }

  async getAllClients(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    name?: string;
    clientCode?: string;
    deletedStatus?: string;
  }): Promise<{
    items: Client[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      return await this.clientRepository.getAllClients(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClientById(id: string): Promise<Client> {
    try {
      return await this.clientRepository.getClientById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    try {
      return await this.clientRepository.createClient(client);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    try {
      return await this.clientRepository.updateClient(id, client);
    } catch (error) {
      console.log("error in user service", error);
      
      throw this.handleError(error);
    }
  }

  async deleteClient(id: string): Promise<void> {
    try {
      await this.clientRepository.deleteClient(id);
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
