let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Deshabilitado temporalmente por error de compilación
    optimizeCss: false,
    // optimizePackageImports desactivado temporalmente
    // optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['v0.dev', 'localhost'],
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    // Evitar WebAssembly md4 hash que falla en Node 20.10
    config.output.hashFunction = 'xxhash64'
    return config
  },
  poweredByHeader: false,
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

mergeConfig(nextConfig, userConfig)

export default nextConfig
