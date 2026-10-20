import type { NextConfig } from "next";

// Backend that /api/* and /uploads/* are proxied to (read at build time). All API calls,
// including banners, go through these rewrites so there is one place to configure it.
const BACKEND_URL = (process.env.BACKEND_URL || "http://127.0.0.1:5050").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      ...["/admin/:path*", "/cart", "/checkout", "/orders", "/profile", "/settings", "/wishlist", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-otp"].map(
        (source) => ({ source, headers: noindex })
      ),
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
