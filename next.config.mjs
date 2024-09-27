/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false; // Disable Webpack cache temporarily
    return config;
  },
};

export default nextConfig;
