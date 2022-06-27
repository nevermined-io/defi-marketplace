/** @type {import('next').NextConfig} */

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URI || "http://localhost:8030"
const faucetUrl = process.env.NEXT_PUBLIC_FAUCET_URI || "http://localhost:3001"

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    staticFolder: '/public'
  },
  rewrites() {
    return [
      {
        source: '/api/gateway/:path*',
        destination: `${gatewayUrl}/:path*`,
      },
      {
        source: '/api/faucet/:path*',
        destination: `${faucetUrl}/:path*`,
      },
    ]
  },
}
