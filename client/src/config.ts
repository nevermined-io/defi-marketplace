//
// NEVERMINED REMOTE CONNECTIONS
//
export const marketplaceUri = process.env.NEXT_PUBLIC_MARKETPLACE_API || 'http://localhost:3100' // next redirections on next.config.js
export const gatewayUri = process.env.NEXT_PUBLIC_GATEWAY_URI || 'http://localhost:8030' // next redirections on next.config.js
export const faucetUri = '/api/faucet' // next redirections on next.config.js
export const gatewayAddress =
  process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
export const nodeUri = process.env.NEXT_PUBLIC_NODE_URI || 'http://localhost:8545'
export const secretStoreUri = process.env.NEXT_PUBLIC_SECRET_STORE_URI || 'http://localhost:12001'
export const artifactsFolder =
  process.env.NEXT_PUBLIC_ARTIFACTS_FOLDER_URL || `http://localhost:3000/artifacts`

export const NFT_TIERS = [
  { 'level': 1, 'name': 'Community', 'did': process.env.DID_NFT_TIER1 || 'c908e49f574f7af755e47cf8e82ea9b686c4f00b7b583a95bfb66727b6e93117', 'address':  process.env.NFT_ADDRESS_TIER1 || '0x90d986e8307A8Ee01C315447235A659f76fE2244' },
  { 'level': 2, 'name': 'Analyst', 'did': process.env.DID_NFT_TIER2 || '06297b4ca9d675416a4c9bcd2b9c098d70fc433b1e672111091e134318be2d75', 'address':  process.env.NFT_ADDRESS_TIER2 || '0x85675aC6cB590eb98bB1D1A6D5840056f8a303AF'  },
  { 'level': 3, 'name': 'Enterprise', 'did': process.env.DID_NFT_TIER3 || '764eeb81b31e727b68bcfc344627aaceacbf3c6460ef67f8c1f1da655c00698d', 'address':  process.env.NFT_ADDRESS_TIER3 || '0x5D8a60E34bB8Da1569B520527B30c38a6114B2aD'  },
]
export const NFT_TIERS_HOLDER = process.env.NFT_TIERS_HOLDER || '0x819dd6c82ad96e0B7B71Bf9161C90cFcd48E4dA5'
export const NFT_TIERS_AMOUNT: number = Number(process.env.NFT_TIERS_AMOUNT) || 1
export const NFT_TIERS_TYPE = 721

export const SUBSCRIPTION_DURATION_IN_BLOCKS= process.env.SUBSCRIPTION_DURATION_IN_BLOCKS ||10000
export const NETWORK_BLOCK_INTERVAL = process.env.NETWORK_BLOCK_INTERVAL || 2
export const SUBSCRIPTION_DURATION_IN_SEGS = +SUBSCRIPTION_DURATION_IN_BLOCKS * +NETWORK_BLOCK_INTERVAL

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

export const sampleUri = '/api/v1/sample'
export const filecoinUploadUri = '/api/v1/gateway/services/upload/filecoin'
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
export const assetTypes = ['dataset', 'report', 'notebook']
export const networks = ['None'].concat(networkArray)
export const notebookLanguages = ['Python', 'Java', 'Scala', 'R', 'SQL', 'Other']
export const notebookFormats = [
  'Source code',
  'Jupyter (.ipynb)',
  'PDF',
  'Zeppelin (.json)',
  'Zip',
  'Other'
]
export const reportTypes = ['Aggregation', 'Enrichment', 'Merge', 'Transformation', 'Other']
export const reportFormats = ['CSV', 'Excel', 'PDF', 'Other']

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
