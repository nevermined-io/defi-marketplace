import React from 'react'
import Web3 from 'web3'
import { DDO, Nevermined } from '@nevermined-io/nevermined-sdk-js'

import { MarketProviderState } from './MarketProvider'

export const User = React.createContext({
    isLogged: false,
    isBurner: false,
    isWeb3Capable: false,
    isLoading: false,
    account: '',
    web3: {} as Web3,
    sdk: {} as Nevermined,
    balance: {
        eth: 0,
        nevermined: 0
    },
    network: '',
    requestFromFaucet: () => {
        /* empty */
    },
    loginMetamask: () => {
        /* empty */
    },
    loginBurnerWallet: () => {
        /* empty */
    },
    switchToCorrectNetwork: () => {
        /* empty */
    },
    message: '',
    tokenSymbol: '',
    tokenDecimals: 6,
    basket: [] as string[],
    addToBasket: (dids: string[]) => {
        /* empty */
    },
    removeFromBasket: (dids: string[]) => {
        /* empty */
    },
    assets: [] as DDO[],
    setAssets: (assets: DDO[]) => {
      /* empty */
    }
})

export const Market = React.createContext<MarketProviderState>({
    totalAssets: 0,
    categories: [],
    network: '',
    networkMatch: false
})
