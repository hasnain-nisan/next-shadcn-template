import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { IUserService } from "../interfaces/IUserService";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";
import { User } from "@/types/user.types";

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor() {
    this.userRepository = RepositoryFactory.getUserRepository();
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    email?: string;
    role?: string;
    deletedStatus?: string;
    accessScopes?: string[];
  }): Promise<{
    items: User[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      return await this.userRepository.getAllUsers(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // async getNoteById(id: string): Promise<Note> {
  //   try {
  //     return await this.noteRepository.getNoteById(id);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // async createNote(note: Partial<Note>): Promise<Note> {
  //   try {
  //     return await this.noteRepository.createNote(note);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // async updateNote(id: string, note: Partial<Note>): Promise<Note> {
  //   try {
  //     return await this.noteRepository.updateNote(id, note);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // async deleteNote(id: string): Promise<void> {
  //   try {
  //     await this.noteRepository.deleteNote(id);
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

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
