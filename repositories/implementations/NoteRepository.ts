import { Note } from "@/types/note.types";
import { INoteRepository } from "../interfaces/INoteRepository";

import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";

export class NoteRepository implements INoteRepository {
  constructor() {}

  async getAllNotes(): Promise<Note[]> {
    return makeApiRequest<Note[]>(API_ENDPOINTS.notes.getAll);
  }

  async getNoteById(id: string): Promise<Note> {
    return makeApiRequest<Note>(`${API_ENDPOINTS.notes.getById(id)}`);
  }

  async createNote(note: Partial<Note>): Promise<Note> {
    return makeApiRequest<Note>(API_ENDPOINTS.notes.create, {
      method: "POST",
      body: JSON.stringify(note),
    });
  }

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    return makeApiRequest<Note>(`${API_ENDPOINTS.notes.update(id)}`, {
      method: "PUT",
      body: JSON.stringify(note),
    });
  }

  async deleteNote(id: string): Promise<void> {
    await makeApiRequest<void>(`${API_ENDPOINTS.notes.delete(id)}`, {
      method: "DELETE",
    });
  }

  async toggleFavorite(id: string): Promise<Note> {
    return makeApiRequest<Note>(`${API_ENDPOINTS.notes.toggleFavorite(id)}`, {
      method: "PATCH",
    });
  }
}
