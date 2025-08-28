import { User } from "@/types/user.types";

export interface IUserService {
  getAllUsers(params?: {
    page?: number;
    limit?: number;
    sortField?: string | null;
    sortOrder?: "asc" | "desc" | null;
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
