import { IAuthService } from "@/services/interfaces/IAuthService";
import { AuthService } from "./implementations/AuthService";
import { IUserService } from "./interfaces/IUserService";
import { UserService } from "./implementations/UserService";
import { ClientService } from "./implementations/ClientService";
import { IClientService } from "./interfaces/IClientService";
import { IClientStakeholderService } from "./interfaces/IClientStakeholderService";
import { ClientStakeholderService } from "./implementations/ClientStakeholderService";
import { IProjectService } from "./interfaces/IProjectService";
import { ProjectService } from "./implementations/ProjectService";
import { IInterviewService } from "./interfaces/IInterviewService";
import { InterviewService } from "./implementations/InterviewService";
import { DashboardService } from "./implementations/DashboardService";
import { IDashboardService } from "./interfaces/IDashboardService";

export class ServiceFactory {
  private static readonly instances = new Map<string, unknown>();

  private static getService<T>(key: string, creator: () => T): T {
    if (!this.instances.has(key)) {
      this.instances.set(key, creator());
    }
    return this.instances.get(key) as T;
  }

  static getAuthService(): IAuthService {
    return this.getService("authService", () => new AuthService());
  }

  static getUserService(): IUserService {
    return this.getService("userService", () => new UserService());
  }

  static getClientService(): IClientService {
    return this.getService("clientService", () => new ClientService());
  }

  static getClientStakeholderService(): IClientStakeholderService {
    return this.getService(
      "clientStakeholderService",
      () => new ClientStakeholderService()
    );
  }

  static getProjectService(): IProjectService {
    return this.getService("projectService", () => new ProjectService());
  }

  static getInterviewService(): IInterviewService {
    return this.getService("interviewService", () => new InterviewService());
  }

  static getDashboardService(): IDashboardService {
    return this.getService("dashboardService", () => new DashboardService());
  }
}
