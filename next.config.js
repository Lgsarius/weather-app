/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This is important for Capacitor
  distDir: 'out'
}

module.exports = nextConfig 