/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['v0.dev', 'localhost'],
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  // Add performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
}

export default nextConfig

