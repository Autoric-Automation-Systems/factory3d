import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { optimizePackageImports: ["@react-three/drei"] },
};

export default nextConfig;
