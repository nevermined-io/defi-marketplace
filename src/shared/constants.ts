export enum Category {
  Dex = 'Dex',
  Lending = 'Lending',
}
export const categories = Object.keys(Category)

export enum Subcategory {
  Trades = 'Trades',
  Borrows = 'Borrows',
  Deposits = 'Deposits',
  Flashloans = 'Flashloans',
  Liquidations = 'Liquidations',
  Redeems = 'Redeems',
  Repays = 'Repays',
}
export const subcategories = Object.keys(Subcategory)

export enum Network {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
  Arbitrum = 'Arbitrum',
  Bsc = 'BSC',
  Fantom = 'Fantom',
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


