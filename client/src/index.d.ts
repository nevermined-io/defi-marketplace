import { MetaMask } from '@nevermined-io/catalog-providers'

declare global {
  interface Window {
    ethereum: any
    web3: MetaMask.MetamaskProvider
  }
}
