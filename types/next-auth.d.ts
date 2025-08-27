import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      accessScopes?: Record<string, boolean>;
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    accessScopes?: Record<string, boolean>;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExp?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: string;
    accessScopes?: Record<string, boolean>;
    accessToken?: string;
    accessTokenExp?: number;
    refreshToken?: string;
  }
}
