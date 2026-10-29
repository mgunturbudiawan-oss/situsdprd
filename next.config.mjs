/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Vercel membatasi body fungsi serverless ±4,5 MB; di server sendiri boleh lebih besar.
    serverActions: { bodySizeLimit: process.env.VERCEL ? "4.5mb" : "25mb" },
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
