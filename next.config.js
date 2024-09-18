/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains
      },
    ],
  },
  eslint: {
    // This option ensures that ESLint errors will not stop the build process.
    ignoreDuringBuilds: false,
  },
  // Additional configuration can be added here if necessary
}

module.exports = nextConfig
