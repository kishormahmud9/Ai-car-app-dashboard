/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.2dehands.com",
      },
      {
        protocol: "https",
        hostname: "twhbe.images.icas.io",
      },
    ],
  },
};

export default nextConfig;
