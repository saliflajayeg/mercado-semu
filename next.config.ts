import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Hosts the app is served from. Next.js's CSRF check rejects Server
      // Action POSTs (login, signup, publish) whose Origin isn't listed, so
      // forms would silently fail. Covers: the production domain, the Render
      // host, the Cloudflare quick tunnel (fallback), and local dev.
      allowedOrigins: [
        "mercadosemu.com",
        "www.mercadosemu.com",
        "*.onrender.com",
        "*.trycloudflare.com",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
