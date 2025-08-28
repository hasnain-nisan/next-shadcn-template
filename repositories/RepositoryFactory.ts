import { AuthRepository } from "./implementations/AuthRepository";
import { UserRepository } from "./implementations/UserRepository";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IUserRepository } from "./interfaces/IUserRepository";

export class RepositoryFactory {
  private static readonly instances = new Map<string, unknown>();

  static getRepository<T>(key: string, creator: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  static getAuthRepository(): IAuthRepository {
    return this.getRepository("auth", () => new AuthRepository());
  }

  static getUserRepository(): IUserRepository {
    return this.getRepository("user", () => new UserRepository());
  }
}
