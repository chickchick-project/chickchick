import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Bundle Analyzer 설정
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    // dev: 개발 서버(Turbopack/Webpack)가 실행 중일 때 true
    // !dev: 프로덕션 빌드 (npm run build)일 때만 적용

    if (!dev) {
      // 1. @hono/swagger-ui 패키지를 빈 모듈(false)로 대체
      config.resolve.alias["@hono/swagger-ui"] = false;

      // 2. Swagger UI의 핵심 용량을 차지하는 패키지 자체도 빈 모듈로 대체 (이중 안전장치)
      config.resolve.alias["swagger-ui-dist"] = false;

      // 3. swagger-ui-react도 프로덕션 빌드에서 제외
      config.resolve.alias["swagger-ui-react"] = false;

      // 혹시 모르니 lodash도 제거가 필요하다면
      // config.resolve.alias['lodash'] = false;
    }
    return config;
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 340, 384, 680],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wvedpvxspndgyoisudyr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        pathname: "/**",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-hook-form",
      "zustand",
      "swiper",
      "chart.js",
      "react-chartjs-2",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=299",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
