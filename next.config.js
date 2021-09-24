/** @type {import('next').NextConfig} */

const metadataUrl = process.env.REACT_APP_METADATA_URI || "https://metadata.mumbai.nevermined.rocks"
const gatewayUrl = process.env.REACT_APP_GATEWAY_URI || "https://gateway.mumbai.nevermined.rocks"
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
        destination: `${metadataUrl}/:path*`,
      },
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
