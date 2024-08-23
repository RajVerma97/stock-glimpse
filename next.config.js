/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose", // Optional: for handling ESM external packages loosely
    serverComponentsExternalPackages: ["mongoose"], // Optional: external packages for server components
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com','static2.finnhub.io'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
