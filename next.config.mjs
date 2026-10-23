/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be hosted anywhere (Vercel, S3, Cloudflare Pages).
  // Remove `output` if you need server features later.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // Hide the dev-mode "N" badge.
  devIndicators: false,
};

export default nextConfig;
