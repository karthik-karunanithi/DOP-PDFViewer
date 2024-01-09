// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/:site_path/:data",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
