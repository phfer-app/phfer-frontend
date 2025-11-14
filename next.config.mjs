/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Gerar site estático para Cloudflare Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
