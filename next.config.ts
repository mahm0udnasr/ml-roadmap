import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/roadmap",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
