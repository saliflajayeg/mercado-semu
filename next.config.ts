import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // The app is served to the public through a Cloudflare quick tunnel
      // (*.trycloudflare.com), whose host differs from the local server host.
      // Without this, Next.js's CSRF check rejects Server Action POSTs (login,
      // signup, publish), so forms silently fail over the tunnel.
      allowedOrigins: ["*.trycloudflare.com", "localhost:3000"],
    },
  },
};

export default nextConfig;
