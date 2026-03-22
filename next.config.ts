import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Giảm bundle lucide: chỉ import icon dùng tới
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-web-stg.ddverp.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-web-stg.ddverp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-v2.didongviet.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "giaphatbattery.com",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
