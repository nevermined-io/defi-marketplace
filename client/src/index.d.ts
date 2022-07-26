import { MetaMask } from 'catalog-providers-test'

declare global {
  interface Window {
    ethereum: any
    web3: MetaMask.MetamaskProvider
  }
}
