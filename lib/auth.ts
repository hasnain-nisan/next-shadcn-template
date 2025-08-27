import { jwtDecode } from "jwt-decode";
import { ServiceFactory } from "@/services/ServiceFactory";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const authService = ServiceFactory.getAuthService();
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          // Decode backend access token to read `exp`
          const decoded: { exp: number } = jwtDecode(response.access_token);

          // Map snake_case from backend → camelCase for frontend consistency
          return {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            accessScopes: response.user.accessScopes,
            accessToken: response.access_token,
            accessTokenExp: decoded.exp,
          };
        } catch (error) {
          const errorMessage =
            (error as { response: { data: { message: string } } })?.response?.data?.message ||
            (error as Error)?.message ||
            "Invalid email or password";
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial login, set everything
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.accessScopes = user.accessScopes;
        token.accessTokenExp = user.accessTokenExp;

        // Force NextAuth JWT expiry to match backend expiry
        token.exp = user.accessTokenExp;
      }

      // On every call, if we already have a backend expiry, keep NextAuth's exp in sync
      if (token.accessTokenExp) {
        token.exp = token.accessTokenExp;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string | undefined;
      session.user.accessScopes = token.accessScopes as
        | Record<string, boolean>
        | undefined;
      session.accessToken = token.accessToken;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  secret: process.env.NEXTAUTH_SECRET,
};
