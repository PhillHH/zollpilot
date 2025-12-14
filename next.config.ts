import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables smaller production image via `.next/standalone` for Docker
  output: "standalone",
};

export default nextConfig;
