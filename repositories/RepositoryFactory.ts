import { AuthRepository } from "./implementations/AuthRepository";
import { ClientRepository } from "./implementations/ClientRepository";
import { ClientStakeholderRepository } from "./implementations/ClientStakeholderRepository";
import { UserRepository } from "./implementations/UserRepository";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IClientRepository } from "./interfaces/IClientRepository";
import { IClientStakeholderRepository } from "./interfaces/IClientStakeholderRepository";
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

  static getClientRepository(): IClientRepository {
    return this.getRepository("client", () => new ClientRepository());
  }

  static getClientStakeholderRepository(): IClientStakeholderRepository {
    return this.getRepository("clientStakeholder", () => new ClientStakeholderRepository());
  }
}
