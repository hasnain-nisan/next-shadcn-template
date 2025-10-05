import { AdminSettingsRepository } from "./implementations/AdminSettingsRepository";
import { AuthRepository } from "./implementations/AuthRepository";
import { BulkUploadRepository } from "./implementations/BulkUploadRepository";
import { ClientRepository } from "./implementations/ClientRepository";
import { ClientStakeholderRepository } from "./implementations/ClientStakeholderRepository";
import { ConfigRepository } from "./implementations/ConfigRepository";
import { DashboardRepository } from "./implementations/DashboardRepository";
import { InterviewRepository } from "./implementations/InterviewRepository";
import { ProjectRepository } from "./implementations/ProjectRepository";
import { UserRepository } from "./implementations/UserRepository";
import { IAdminSettingsRepository } from "./interfaces/IAdminSettingsRepository";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IBulkUploadRepository } from "./interfaces/IBulkUploadRepository";
import { IClientRepository } from "./interfaces/IClientRepository";
import { IClientStakeholderRepository } from "./interfaces/IClientStakeholderRepository";
import { IConfigRepository } from "./interfaces/IConfigRepository";
import { IDashboardRepository } from "./interfaces/IDashboardRepository";
import { IInterviewRepository } from "./interfaces/IInterviewRepository";
import { IProjectRepository } from "./interfaces/IProjectRepository";
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
    return this.getRepository(
      "clientStakeholder",
      () => new ClientStakeholderRepository()
    );
  }

  static getProjectRepository(): IProjectRepository {
    return this.getRepository("project", () => new ProjectRepository());
  }

  static getInterviewRepository(): IInterviewRepository {
    return this.getRepository("interview", () => new InterviewRepository());
  }

  static getDashboardRepository(): IDashboardRepository {
    return this.getRepository("dashboard", () => new DashboardRepository());
  }

  static getAdminSettingsRepository(): IAdminSettingsRepository {
    return this.getRepository("adminSettings", () => new AdminSettingsRepository());
  }

  static getConfigRepository(): IConfigRepository {
    return this.getRepository("config", () => new ConfigRepository());
  }
  static getBulkUploadRepository(): IBulkUploadRepository {
    return this.getRepository("bulkUpload", () => new BulkUploadRepository());
  }
}
