/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.LUI_API_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.LUI_API_BASE_URL || "http://localhost:5100/v1/"}:path*`,
      },
    ];
  },
};

export default nextConfig;
