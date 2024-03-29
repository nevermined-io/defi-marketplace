//
// NEVERMINED REMOTE CONNECTIONS
//

import { chain } from "wagmi";

export const marketplaceUri = process.env.NEXT_PUBLIC_MARKETPLACE_API || 'https://marketplace-api-public.nevermined.network' // next redirections on next.config.js
export const neverminedNodeUri = process.env.NEXT_PUBLIC_GATEWAY_URI || 'https://node.mumbai.public.nevermined.network' // next redirections on next.config.js
export const faucetUri = '/api/faucet' // next redirections on next.config.js
export const neverminedNodeAddress =
  process.env.NEXT_PUBLIC_GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
export const web3ProviderUri = process.env.NEXT_PUBLIC_NODE_URI || 'http://localhost:8545'
export const secretStoreUri = process.env.NEXT_PUBLIC_SECRET_STORE_URI || 'http://localhost:12001'
export const artifactsFolder =
  process.env.NEXT_PUBLIC_ARTIFACTS_FOLDER_URL || `http://localhost:3000/artifacts`

export const NFT_TIERS = [
  {
    'level': 1,
    'name': 'Community',
    'did': process.env.NEXT_PUBLIC_DID_NFT_TIER1 || 'a35e762bd857bf3f488dc1d2b7e3879fa3f92b6492fa22c03be470bf28c1b2e1',
    'address': process.env.NEXT_PUBLIC_NFT_ADDRESS_TIER1 || '0x95Ba21f858b57beb7B19990E8B072EF52999856D'
  },
  {
    'level': 2,
    'name': 'Analyst',
    'did': process.env.NEXT_PUBLIC_DID_NFT_TIER2 || '9e60322c32cafe73153ac9c315773b04c34829b89e56d2b73baedc7f0816346e',
    'address': process.env.NEXT_PUBLIC_NFT_ADDRESS_TIER2 || '0x1B058140C5448f0e0e6d2a09711F7ABc6BE07411'
  },
  {
    'level': 3,
    'name': 'Enterprise',
    'did': process.env.NEXT_PUBLIC_DID_NFT_TIER3 || '72b8302b75dd2c16fb2c4db60757f779c3f7927068f0a50e4d0508103edffbe5',
    'address': process.env.NEXT_PUBLIC_NFT_ADDRESS_TIER3 || '0x2dBafaa2f8362C763f49CcDcA35a882386D455c5'
  },
]
export const NFT_TIERS_HOLDER = process.env.NEXT_PUBLIC_NFT_TIERS_HOLDER || '0xe2DD09d719Da89e5a3D0F2549c7E24566e947260'
export const NFT_TIERS_AMOUNT: number = Number(process.env.NEXT_PUBLIC_NFT_TIERS_AMOUNT) || 1
export const NFT_TIERS_TYPE = 721

export const SUBSCRIPTION_DURATION_IN_BLOCKS = process.env.NEXT_PUBLIC_SUBSCRIPTION_DURATION_IN_BLOCKS || 15770000
export const NETWORK_BLOCK_INTERVAL = process.env.NEXT_PUBLIC_NETWORK_BLOCK_INTERVAL || 2
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
export const filecoinUploadUri = '/api/v1/node/services/upload/filecoin'
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
export const SUPPORTED_NETWORKS = [chain.polygon, chain.polygonMumbai]
export const CORRECT_NETWORK_ID = 80001
