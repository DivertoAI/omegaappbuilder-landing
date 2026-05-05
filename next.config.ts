import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.omegaappbuilder.com" }],
        destination: "https://omegaappbuilder.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/site-api/:path*", destination: "/api/:path*" },
        { source: "/omega-reach/whatsapp", destination: "/omega-reach/whatsapp/index.html" },
        { source: "/omega-reach/whatsapp/", destination: "/omega-reach/whatsapp/index.html" },
        { source: "/api", destination: "http://168.144.19.198:8788/api" },
        { source: "/api/:path*", destination: "http://168.144.19.198:8788/api/:path*" }
      ]
    };
  }
};

export default nextConfig;
