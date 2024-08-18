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
};

module.exports = nextConfig;
