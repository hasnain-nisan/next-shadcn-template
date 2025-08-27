import { IAuthRepository } from "@/repositories/interfaces/IAuthRepository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/types/auth.types";
import { Session } from "next-auth";
import { IAuthService } from "../interfaces/IAuthService";

export class AuthService implements IAuthService {
  private authRepository: IAuthRepository;

  constructor() {
    this.authRepository = RepositoryFactory.getAuthRepository();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.authRepository.login(credentials);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.authRepository.register(credentials);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn("Server logout failed:", error);
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      return await this.authRepository.getCurrentSession();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // async refreshToken(): Promise<RefreshTokenResponse> {
  //   try {
  //     const response = await this.authRepository.refreshToken({ refreshToken });
  //     return response;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async isAuthenticated(): Promise<boolean> {
    const response = await this.authRepository.isAuthenticated();
    return response;
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unexpected error occurred");
  }
}
