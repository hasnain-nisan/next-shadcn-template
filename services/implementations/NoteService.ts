import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { INoteRepository } from "@/repositories/interfaces/INoteRepository";
import { Note } from "@/types/note.types";
import { INoteService } from "../interfaces/INoteService";

export class NoteService implements INoteService {
  private noteRepository: INoteRepository;

  constructor() {
    this.noteRepository = RepositoryFactory.getNoteRepository();
  }

  async getAllNotes(): Promise<Note[]> {
    try {
      return await this.noteRepository.getAllNotes();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNoteById(id: string): Promise<Note> {
    try {
      return await this.noteRepository.getNoteById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createNote(note: Partial<Note>): Promise<Note> {
    try {
      return await this.noteRepository.createNote(note);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    try {
      return await this.noteRepository.updateNote(id, note);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      await this.noteRepository.deleteNote(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async toggleFavorite(id: string): Promise<Note> {
    try {
      return await this.noteRepository.toggleFavorite(id);
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
