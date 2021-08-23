import React from 'react'
import { MarketProviderState } from './MarketProvider'

export const User = React.createContext({
    isLogged: false,
    isBurner: false,
    isWeb3Capable: false,
    isLoading: false,
    account: '',
    web3: {},
    sdk: {},
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
    message: '',
    tokenSymbol: ''
})

export const Market = React.createContext<MarketProviderState>({
    totalAssets: 0,
    categories: [],
    network: '',
    networkMatch: false
})
