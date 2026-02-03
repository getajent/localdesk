import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize CSS delivery
  compiler: {
    // Remove unused CSS in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable experimental optimizations
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,
  },
};

export default nextConfig;
