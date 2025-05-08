import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wvedpvxspndgyoisudyr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
