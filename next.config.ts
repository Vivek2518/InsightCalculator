import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance & Bundle Size Optimization
  productionBrowserSourceMaps: false, // Hide source maps in production
  compress: true, // Enable gzip compression
  
  // Optimizations for fast performance
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Static page generation
  staticPageGenerationTimeout: 300,
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
        ],
      },
      // Cache static assets (1 year for static calculator JSON)
      {
        source: "/calculators/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  // Redirects for canonical domain
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "insightcalculator.com",
          },
        ],
        destination: "https://www.insightcalculator.com/:path*",
        permanent: true,
      },
      // Redirect http to https
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://www.insightcalculator.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
