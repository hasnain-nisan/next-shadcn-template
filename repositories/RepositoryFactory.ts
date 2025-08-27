import { AuthRepository } from "./implementations/AuthRepository";
import { NoteRepository } from "./implementations/NoteRepository";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { INoteRepository } from "./interfaces/INoteRepository";

export class RepositoryFactory {
  private static instances = new Map<string, unknown>();

  static getRepository<T>(key: string, creator: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  static getAuthRepository(): IAuthRepository {
    return this.getRepository("auth", () => new AuthRepository());
  }

  static getNoteRepository(): INoteRepository {
    return this.getRepository("note", () => new NoteRepository());
  }
}