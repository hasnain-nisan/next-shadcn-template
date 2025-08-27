import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/types/auth.types";
import { Session } from "next-auth";

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<Session | null>;
  isAuthenticated(): Promise<boolean>;
}
