import { Note } from "@/types/note.types";

export interface INoteService {
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note>;
  createNote(note: Partial<Note>): Promise<Note>;
  updateNote(id: string, note: Partial<Note>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<Note>;
}