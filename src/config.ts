//
// marketplace-server connection
//
export const serviceUri =
    process.env.REACT_APP_SERVICE_URI || 'http://localhost:4000'

//
// NEVERMINED REMOTE CONNECTIONS
//
export const metadataUri = "/api/metadata" // next redirections on next.config.js
export const gatewayUri = "/api/gateway" // next redirections on next.config.js
export const faucetUri = "/api/faucet" // next redirections on next.config.js
export const gatewayAddress =
    process.env.REACT_APP_GATEWAY_ADDRESS || "0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0"
export const nodeUri =
    process.env.REACT_APP_NODE_URI || "http://localhost:8545"
export const secretStoreUri =
    process.env.REACT_APP_SECRET_STORE_URI || "http://localhost:12001"

//
// APP CONFIG
//
export const verbose = true
export const analyticsId =
    process.env.REACT_APP_ANALYTICS_ID || '---'

export const showChannels =
    process.env.REACT_APP_SHOW_CHANNELS === 'true' || false
export const allowPricing = true
export const showRequestTokens =
    process.env.REACT_APP_SHOW_REQUEST_TOKENS_BUTTON === 'true' || false
// https://ipfs.github.io/public-gateway-checker/
export const ipfsGatewayUri =
    process.env.REACT_APP_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
export const ipfsNodeUri =
    process.env.REACT_APP_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'
