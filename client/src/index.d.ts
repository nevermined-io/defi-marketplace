import { MetaMask } from '@nevermined-io/providers'

declare global {
  interface Window {
    ethereum: any
    web3: MetaMask.MetamaskProvider
  }
}
