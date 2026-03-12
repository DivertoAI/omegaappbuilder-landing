import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/omega-reach/whatsapp", destination: "/omega-reach/whatsapp/index.html" },
      { source: "/omega-reach/whatsapp/", destination: "/omega-reach/whatsapp/index.html" }
    ];
  }
};

export default nextConfig;
