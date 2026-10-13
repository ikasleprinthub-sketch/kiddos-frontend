import type { NextConfig } from "next";

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
        destination: "http://127.0.0.1:5050/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://127.0.0.1:5050/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
