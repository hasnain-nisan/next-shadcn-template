import { IAuthService } from "@/services/interfaces/IAuthService";
import { AuthService } from "./implementations/AuthService";
import { IUserService } from "./interfaces/IUserService";
import { UserService } from "./implementations/UserService";

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
}
