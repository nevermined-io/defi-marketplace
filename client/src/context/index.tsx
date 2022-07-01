import React from 'react'
import Web3 from 'web3'
import { Account, DDO, Nevermined, Profile, Bookmark } from '@nevermined-io/nevermined-sdk-js'

import { MarketProviderState } from './MarketProvider'
import { Bundle } from '../shared/api';

export const User = React.createContext({
    isLogged: false,
    isBurner: false,
    isWeb3Capable: false,
    isLoading: false,
    walletAddress: '',
    bookmarks: [] as Bookmark[],
    userBundles: [] as Bundle[],
    userProfile: {} as Profile,
    web3: {} as Web3,
    balance: {
        eth: 0,
        nevermined: 0
    },
    network: '',
    loginMetamask: () => {
        /* empty */
    },
    loginMarketplaceAPI: (sdk: Nevermined, account: Account) => {
        /* empty */
    },
    switchToCorrectNetwork: () => {
        /* empty */
    },
    sdk: {} as Nevermined,
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
    },
    searchInputText: '',
    setSearchInputText: (searchInputText: string) => {
        /* empty */
    },
    fromDate: '',
    setFromDate: (fromDate: string) => {
        /* empty */
    },
    toDate: '',
    setToDate: (toDate: string) => {
        /* empty */
    },
    selectedCategories: [] as string[],
    setSelectedCategories: (selectedCategories: string[]) => {
        /* empty */
    },
    selectedNetworks: [] as string[],
    setSelectedNetworks: (selectedNetworks: string[]) => {
        /* empty */
    },
    selectedPrice: 0,
    setSelectedPriceRange: (selectedPrice: number) => {
        /* empty */
    },
    setAllUserBundles: (account: string) => {
        /* empty */
    },
    setBookmarks: (bookmarks: Bookmark[]) => {
        /* empty */
    }
})

export const Market = React.createContext<MarketProviderState>({
    totalAssets: 0,
    categories: [],
    network: '',
    networkMatch: false
})
