import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: "9f2a1c8b5f3e4d2a7b9e6c1d3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    API_BASE_URL: "https://nestjs-backend-622273141210.us-central1.run.app/api/v1",
    NEXTAUTH_URL: "https://nextjs-frontend-622273141210.us-central1.run.app",
    // API_BASE_URL: "http://localhost:4000/api/v1",
    // NEXTAUTH_URL: "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME: "TP Interview App",
  },
};

export default nextConfig;
