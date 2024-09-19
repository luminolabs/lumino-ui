/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: process.env.NEXT_PUBLIC_API_BASE_URL,
      },
    ];
  },
};

export default nextConfig;
