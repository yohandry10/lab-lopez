import crypto from 'node:crypto'

class SafeHash {
  constructor () {
    this._hash = crypto.createHash('sha256')
  }
  update (data) {
    this._hash.update(data ?? '')
    return this
  }
  digest (enc) {
    return this._hash.digest(enc)
  }
  copy () {
    const copy = new SafeHash()
    // copy internal state if available (Node18+)
    if (typeof this._hash.copy === 'function') {
      copy._hash = this._hash.copy()
    }
    return copy
  }
}

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
    // Evitar fallo "data argument must be ... Received undefined" cuando Webpack genera el hash.
    // Usamos función personalizada que garantiza que siempre se pasa string (al menos vacío).
    config.output.hashFunction = SafeHash
    return config
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
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
