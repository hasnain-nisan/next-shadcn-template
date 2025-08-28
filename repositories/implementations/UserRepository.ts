import { User } from "@/types/user.types";
import { IUserRepository } from "../interfaces/IUserRepository";

import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";

export class UserRepository implements IUserRepository {
  constructor() {}

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
    const query = new URLSearchParams({
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 10),
    });

    if (params?.sortField) {
      query.append("sortField", params.sortField);
    }

    if (params?.sortOrder) {
      query.append("sortOrder", params.sortOrder);
    }

    if (params?.email) {
      query.append("email", params.email);
    }

    if (params?.role) {
      query.append("role", params.role);
    }

    if (params?.deletedStatus) {
      query.append("isDeleted", params.deletedStatus);
    }

    if (params?.accessScopes?.length) {
      params.accessScopes.forEach((scope) => {
        query.append(scope, "true");
      });
    }

    console.log(params?.accessScopes, "accessScopes");

    const endpoint = `${API_ENDPOINTS.users.getAll}?${query.toString()}`;

    return makeApiRequest(endpoint);
  }

  // async getNoteById(id: string): Promise<Note> {
  //   return makeApiRequest<Note>(`${API_ENDPOINTS.notes.getById(id)}`);
  // }

  // async createNote(note: Partial<Note>): Promise<Note> {
  //   return makeApiRequest<Note>(API_ENDPOINTS.notes.create, {
  //     method: "POST",
  //     body: JSON.stringify(note),
  //   });
  // }

  // async updateNote(id: string, note: Partial<Note>): Promise<Note> {
  //   return makeApiRequest<Note>(`${API_ENDPOINTS.notes.update(id)}`, {
  //     method: "PUT",
  //     body: JSON.stringify(note),
  //   });
  // }

  // async deleteNote(id: string): Promise<void> {
  //   await makeApiRequest<void>(`${API_ENDPOINTS.notes.delete(id)}`, {
  //     method: "DELETE",
  //   });
  // }

  // async toggleFavorite(id: string): Promise<Note> {
  //   return makeApiRequest<Note>(`${API_ENDPOINTS.notes.toggleFavorite(id)}`, {
  //     method: "PATCH",
  //   });
  // }
}
