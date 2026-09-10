/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  compress: true,

  experimental: {
    optimizePackageImports: ["react-icons", "motion"],
  },

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [],
  },
};

export default nextConfig;
