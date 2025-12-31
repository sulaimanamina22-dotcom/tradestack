/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"], // Ensures monorepo sharing works
};

module.exports = nextConfig;