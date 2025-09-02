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
  
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // getNoteById(id: string): Promise<Note>;
  // toggleFavorite(id: string): Promise<Note>;
}
