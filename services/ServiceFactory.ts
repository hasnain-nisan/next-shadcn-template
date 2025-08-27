import { IAuthService } from "@/services/interfaces/IAuthService";
import { INoteService } from "@/services/interfaces/INoteService";
import { AuthService } from "./implementations/AuthService";
import { NoteService } from "./implementations/NoteService";

export class ServiceFactory {
  private static instances = new Map<string, unknown>();

  private static getService<T>(key: string, creator: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  static getAuthService(): IAuthService {
    return this.getService("authService", () => new AuthService());
  }

  static getNoteService(): INoteService {
    return this.getService("noteService", () => new NoteService());
  }
}
