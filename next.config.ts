import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    
  },
};

export default nextConfig;
