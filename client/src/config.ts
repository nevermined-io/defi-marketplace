//
// NEVERMINED REMOTE CONNECTIONS
//
export const marketplaceUri = process.env.NEXT_PUBLIC_MARKETPLACE_API || 'http://localhost:3100' // next redirections on next.config.js
export const gatewayUri = process.env.NEXT_PUBLIC_GATEWAY_URI || 'http://localhost:8030' // next redirections on next.config.js
export const faucetUri = '/api/faucet' // next redirections on next.config.js
export const gatewayAddress =
  process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
export const nodeUri = process.env.NEXT_PUBLIC_NODE_URI || 'http://localhost:8545'
export const secretStoreUri = process.env.NEXT_PUBLIC_SECRET_STORE_URI || 'http://localhost:12001'
export const artifactsFolder =
  process.env.NEXT_PUBLIC_ARTIFACTS_FOLDER_URL || `http://localhost:3000/artifacts`

export const tier1NftContractAddress =
  process.env.TIER1_NFT_ADDRESS || '0x18bdFAf7Cc2B66a4Cfa7e069693CD1a9B639A69b'
export const tier2NftContractAddress =
  process.env.TIER1_NFT_ADDRESS || '0x18bdFAf7Cc2B66a4Cfa7e069693CD1a9B639A69b'
export const tier3NftContractAddress =
  process.env.TIER1_NFT_ADDRESS || '0x18bdFAf7Cc2B66a4Cfa7e069693CD1a9B639A69b'
export const Nft721ContractAddress =
  process.env.DEFAULT_NFT721_ADDRESS || '0x18bdFAf7Cc2B66a4Cfa7e069693CD1a9B639A69b'

//
// APP CONFIG
//
export const verbose = true
export const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID || '---'

export const showChannels = process.env.NEXT_PUBLIC_SHOW_CHANNELS === 'true' || false
export const allowPricing = true
export const showRequestTokens =
  process.env.NEXT_PUBLIC_SHOW_REQUEST_TOKENS_BUTTON === 'true' || false
// https://ipfs.github.io/public-gateway-checker/
export const ipfsGatewayUri = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URI || 'https://gateway.ipfs.io'
export const ipfsNodeUri = process.env.NEXT_PUBLIC_IPFS_NODE_URI || 'https://ipfs.infura.io:5001'
export const correctNetworkId = process.env.NEXT_PUBLIC_CORRECT_NETWORK_ID || '0x13881'
export const correctNetworkURL =
  process.env.NEXT_PUBLIC_CORRECT_NETWORK_URL || 'https://matic-mumbai.chainstacklabs.com'
export const correctNetworkName = process.env.NEXT_PUBLIC_CORRECT_NETWORK_NAME || 'mumbai'
export const bundleServiceUri =
  process.env.NEXT_PUBLIC_BUNDLE_SERVICE_URI || 'https://defi.v2.bundler.mumbai.nevermined.rocks'

export const bundleCreateUri = '/api/v1/bundle/create'
export const bundleStatusUri = '/api/v1/bundle/status'
export const userBundlesUri = '/api/v1/user/history'
export const bundleDataset = '/api/v1/bundle/contains'
export const sampleUri = '/api/v1/sample'
export const filecoinUploadUri = '/api/v1/gateway/services/upload/filecoin'
export const BUNDLE_MAX_RETRYS = 12
export const BUNDLE_RETRY_TIMEOUT = 5000
export const BUNDLE_STATUS_COMPLETED = 'COMPLETED'
export const discordUrl = 'https://discord.gg/d8B4BkV3'
export const networkArray = [
  'bsc',
  'avalanche',
  'celo',
  'polygon',
  'optimism',
  'ethereum',
  'fantom',
  'arbitrum'
]

export const categories = [
  'None',
  'Borrows',
  'Deposits',
  'Liquidations',
  'Repays',
  'Redeems',
  'Flashloans',
  'Trades',
  'Liquidity'
]
export const protocols = [
  'None',
  'Aave',
  'Compound',
  'Kashi',
  'Balancer',
  'Bancor',
  'SushiSwap',
  'Dodoex',
  'Ubeswap',
  'Pancakeswap',
  'Pangolin',
  'Traderjoe'
]
export const assetTypes = ['dataset', 'report', 'notebook', 'dashboard']
export const networks = ['None'].concat(networkArray)

export const graphUrl =
  process.env.NEXT_PUBLIC_ACCESS_CONDITION_URI ||
  'https://api.thegraph.com/subgraphs/name/nevermined-io/common'
export const entitesNames = {
  DEXLIQUI: 'Liquidity',
  DEXTRAD: 'Trades',
  LENDBOR: 'Borrows',
  LENDDEP: 'Deposits',
  LENDFLAS: 'FlashLoans',
  LENDLIQ: 'Liquidations',
  LENDRED: 'Redeems',
  LENDREP: 'Repays'
}
export const docsUrl =
  process.env.NEXT_PUBLIC_DOCS_URL || 'https://nevermined-io.github.io/defi-marketplace/'
export const PROTOCOL_PREFIX = 'ProtocolType'
export const EVENT_PREFIX = 'EventType'
