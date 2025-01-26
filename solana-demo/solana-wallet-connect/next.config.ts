import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('encoding');
    return config;
  },
  // 如果需要的话添加以下配置
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;
