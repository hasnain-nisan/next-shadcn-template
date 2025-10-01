import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: "your-secret-key",
    API_BASE_URL: "http://localhost:4000/api/v1",
    NEXTAUTH_URL: "http://localhost:3000",
    // API_BASE_URL: "https://tp-nest-backend.onrender.com/api/v1",
    // NEXTAUTH_URL: "https://tp-admin-mocha.vercel.app",
    NEXT_PUBLIC_APP_NAME: "TP Admin",
  },
};

export default nextConfig;
