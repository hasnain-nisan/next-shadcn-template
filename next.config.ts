import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET: "your-secret-key",
    API_BASE_URL: "http://localhost:4000/api/v1",
    NEXT_PUBLIC_APP_NAME: "Notepad App",
  },
};

export default nextConfig;
