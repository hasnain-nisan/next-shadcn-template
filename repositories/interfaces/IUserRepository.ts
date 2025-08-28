import { User } from "@/types/user.types";

export interface IUserRepository {
  getAllUsers(params?: {
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
  }>;

  // getNoteById(id: string): Promise<Note>;
  // createNote(note: Partial<Note>): Promise<Note>;
  // updateNote(id: string, note: Partial<Note>): Promise<Note>;
  // deleteNote(id: string): Promise<void>;
  // toggleFavorite(id: string): Promise<Note>;
}
