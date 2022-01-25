import { correctNetworkId, correctNetworkURL, correctNetworkName } from '../config'
import { imageConfigDefault } from 'next/dist/server/image-config'
import Web3 from 'web3'

export class MetamaskProvider {
  private web3: Web3

  public constructor() {
    // Default
    this.web3 = null as any
    // Modern dapp browsers
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
    }
    // Legacy dapp browsers
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider)
    }
  }

  public async isAvailable(): Promise<boolean> {
    return this.web3 !== null
  }

  public async isLogged(): Promise<boolean> {
    if (this.web3 === null) return false
    if ((await this.web3.eth.getAccounts()).length > 0) {
      return true
    }
    return false
  }

  public async startLogin(): Promise<void> {
    try {
      await window.ethereum.enable()
      localStorage.setItem('logType', 'Metamask')
    } catch (error) {
      return
    }
  }

  public async logout(): Promise<void> {
    localStorage.removeItem('logType')
    // reload page?
  }

  public getProvider(): any {
    return this.web3
  }

  public async switchChain(): Promise<void> {
    try {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: correctNetworkId }]
          })
        } catch (error) {
          error.code === 4902 ? await this.addNetwork() : console.log(error)
        }
      } else {
        alert(
          'MetaMask is not installed. Please consider installing it: https://metamask.io/download.html'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async addNetwork(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: correctNetworkId,
            chainName: correctNetworkName,
            rpcUrls: [correctNetworkURL]
          }
        ]
      })
    } catch (addError) {
      console.error(addError)
    }
  }
}
