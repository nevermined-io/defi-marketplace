/** @type {import('next').NextConfig} */

const metadataUrl = process.env.REACT_APP_METADATA_URI || "http://metadata:5000"
const gatewayUrl = process.env.REACT_APP_GATEWAY_URI || "http://localhost:8030"
const faucetUrl = process.env.REACT_APP_FAUCET_URI || "http://localhost:3001"

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config
  },
  rewrites() {
    return [
      {
        source: '/api/metadata/:path*',
        destination: `${metadataUrl}/:path*` // Proxy to Backend
      },
      {
        source: '/api/gateway/:path*',
        destination: `${gatewayUrl}/:path*` // Proxy to Backend
      },
      {
        source: '/api/faucet/:path*',
        destination: `${faucetUrl}/:path*` // Proxy to Backend
      },
    ]
  },
}
