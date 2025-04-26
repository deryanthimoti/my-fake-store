import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/shopping-cart",
        missing: [
          {
            type: "cookie",
            key: "auth_token",
          }
        ],
        permanent: false,
        destination: '/login',
      }
    ]
  }
};

export default nextConfig;
