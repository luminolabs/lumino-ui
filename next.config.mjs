/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    async rewrites() {
      return [
        {
          source: '/api/proxy/:path*',
          destination: 'http://localhost:5100/v1/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;