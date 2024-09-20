/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  env: {
    API_BASE_URL: process.env.LUI_API_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.LUI_API_BASE_URL}:path*`,
      },
    ];
  },
};

export default nextConfig;
