import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Arena preview proxy (*.e2b.app) to talk to the dev server
  // (page loads, HMR websocket, cross-origin dev requests).
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
