export enum Category {
  Dex = 'Dex',
  Lending = 'Lending'
}
export const categories = Object.keys(Category)

export enum Subcategory {
  Trades = 'Trades',
  Borrows = 'Borrows',
  Deposits = 'Deposits',
  Flashloans = 'Flashloans',
  Liquidations = 'Liquidations',
  Redeems = 'Redeems',
  Repays = 'Repays'
}
export const subcategories = Object.keys(Subcategory)

export enum Network {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
  Arbitrum = 'Arbitrum',
  Bsc = 'BSC',
  Fantom = 'Fantom'
}
export const networks = Object.keys(Network)

export const categoryPrefix = 'ProtocolType'
export const subcategoryPrefix = 'EventType'
export const networkPrefix = 'Blockchain'

export const MetamaskCustomErrors = {
  CANCELED: [4001, 'The transaction was canceled. Please, approve it to purchase the asset.']
}

export enum MetamaskErrorCodes {
  CANCELED = 4001
}

export enum StoreItemTypes {
  MarketplaceApiToken = 'marketplaceApiToken'
}

export enum State {
  Disabled = 'disabled',
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed'
}

export interface Provenance {
  id: string
  action: string
  date: Date
  account: string
  price: number
  currency: string
}

export enum SubscriptionTiers {
  Tier1 = 'Community',
  Tier2 = "Analyst",
  Tier3 = "Enterprise"
} 

export interface UserSubscription {
  tier: SubscriptionTiers
  did: string
  address: string
  access: boolean
  current: boolean
}
