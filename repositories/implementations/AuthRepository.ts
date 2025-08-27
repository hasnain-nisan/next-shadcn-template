import { IAuthRepository } from "../interfaces/IAuthRepository";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth.types";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { makeApiRequest } from "@/lib/makeApiRequest";
import { API_ENDPOINTS } from "@/lib/constants";

export class AuthRepository implements IAuthRepository {
  constructor() {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return makeApiRequest<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return makeApiRequest<AuthResponse>(API_ENDPOINTS.auth.register, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return makeApiRequest<RefreshTokenResponse>(API_ENDPOINTS.auth.refresh, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async logout(): Promise<void> {
    await signOut({ redirect: false });
  }

  async getCurrentSession(): Promise<Session | null> {
    return await getSession();
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
  }
  async verifyToken(token: string): Promise<boolean> {
    try {
      await makeApiRequest<void>("/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
