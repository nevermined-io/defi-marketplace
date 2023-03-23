/** @type {import('next').NextConfig} */
const path = require('path')
const withTM = require('next-transpile-modules')([
  '@nevermined-io/sdk',
  '@nevermined-io/providers',
  '@nevermined-io/catalog',
])
const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_NODE_ADDRESS: process.env.NEXT_PUBLIC_NODE_ADDRESS,
    NEXT_PUBLIC_NODE_URI: process.env.NEXT_PUBLIC_NODE_URI,
    NEXT_PUBLIC_ACCEPTED_CHAIN_ID: process.env.NEXT_PUBLIC_ACCEPTED_CHAIN_ID,
    NEXT_PUBLIC_MARKETPLACE_API: process.env.NEXT_PUBLIC_MARKETPLACE_API,
    NEXT_PUBLIC_GRAPH_HTTP_URI: process.env.NEXT_PUBLIC_GRAPH_HTTP_URI,
    NEXT_PUBLIC_ERC20_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_ERC20_TOKEN_ADDRESS,
    NEXT_PUBLIC_IPFS_GATEWAY_URI: process.env.NEXT_PUBLIC_IPFS_GATEWAY_URI,
    NEXT_PUBLIC_WIDGET_URI: process.env.NEXT_PUBLIC_WIDGET_URI,
    NEXT_PUBLIC_ARTIFACTS_FOLDER: process.env.NEXT_PUBLIC_ARTIFACTS_FOLDER,
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'))

    fileLoaderRule.exclude = /\.svg$/

    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /.svg$/,
        loader: require.resolve('@svgr/webpack'),
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        options: {
          ref: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIDs: false,
                  },
                },
              },
            ],
          },
        },
      },
    )

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      url: require.resolve('url'),
      assert: require.resolve('assert'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      // os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer/'),
    }

    return config
  },
})

module.exports = nextConfig
