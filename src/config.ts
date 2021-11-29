//
// NEVERMINED REMOTE CONNECTIONS
//
export const metadataUri = "/api/metadata" // next redirections on next.config.js
export const gatewayUri = "/api/gateway" // next redirections on next.config.js
export const faucetUri = "/api/faucet" // next redirections on next.config.js
export const gatewayAddress =
    process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || "0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0"
export const nodeUri =
    process.env.NEXT_PUBLIC_NODE_URI || "https://polygon-mumbai.g.alchemy.com/v2/GHT7ODcuJCgTuQGyvjI92G6hI5hyJLEa"
export const secretStoreUri =
    process.env.NEXT_PUBLIC_SECRET_STORE_URI || "http://localhost:12001"

//
// APP CONFIG
//
export const verbose = true
export const analyticsId =
    process.env.NEXT_PUBLIC_ANALYTICS_ID || '---'

export const showChannels =
    process.env.NEXT_PUBLIC_SHOW_CHANNELS === 'true' || false
export const allowPricing = true
export const showRequestTokens =
    process.env.NEXT_PUBLIC_SHOW_REQUEST_TOKENS_BUTTON === 'true' || false
// https://ipfs.github.io/public-gateway-checker/
export const ipfsGatewayUri =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
export const ipfsNodeUri =
    process.env.NEXT_PUBLIC_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'
export const correctNetworkId =
    process.env.CORRECT_NETWORK_ID || '0x13881'
export const correctNetworkURL =
    process.env.CORRECT_NETWORK_URL || 'https://matic-mumbai.chainstacklabs.com'
export const correctNetworkName =
    process.env.CORRECT_NETWORK_NAME || 'mumbai'
export const correctNetworkTokenName =
    process.env.CORRECT_NETWORK_TOKEN_NAME || 'MATIC'
export const correctNetworkTokenSymbol =
    process.env.CORRECT_NETWORK_TOKEN_SYMBOL || 'MATIC'
