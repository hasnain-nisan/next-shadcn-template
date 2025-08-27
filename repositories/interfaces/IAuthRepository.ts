import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth.types';
import { Session } from 'next-auth';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<Session | null>;
  isAuthenticated(): Promise<boolean>;
  verifyToken(token: string): Promise<boolean>;
}