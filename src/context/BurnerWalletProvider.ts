// import Web3 from 'web3'
// import HDWalletProvider from '@truffle/hdwallet-provider'
// import { nodeUri } from '../config'
// import { requestFromFaucet } from '../nevermined'

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const bip39 = require('bip39')

export class BurnerWalletProvider {
    // private web3: Web3

    public constructor() {
        // Default
        // this.web3 = null as any
    }

    public async isLogged(): Promise<boolean> {
        // if (localStorage.getItem('seedphrase') !== null) {
        //     return true
        // }
        return false
    }

    public async startLogin(): Promise<void> {
        console.warn('BurnerWallet disabled')
        // let mnemonic
        // const isLogged = await this.isLogged()

        // if (isLogged) {
        //     mnemonic = localStorage.getItem('seedphrase')
        // } else {
        //     mnemonic = bip39.generateMnemonic()
        //     localStorage.setItem('seedphrase', mnemonic)
        // }

        // localStorage.setItem('logType', 'BurnerWallet')
        // const provider = new HDWalletProvider(mnemonic, nodeUri, 0, 1)
        // this.web3 = new Web3(provider as any)
        // const accounts = await this.web3.eth.getAccounts()
        // const balance = await this.web3.eth.getBalance(accounts[0])

        // // fill with Ether if account balance is empty
        // balance === '0' && (await requestFromFaucet(provider.getAddress(0)))
    }

    public async logout(): Promise<void> {
        // localStorage.removeItem('seedphrase')
        // localStorage.removeItem('logType')
    }

    public getProvider(): any {
        // return this.web3
    }
}
