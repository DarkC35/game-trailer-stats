/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.CI ? '/game-trailer-stats' : ''
}

module.exports = nextConfig
