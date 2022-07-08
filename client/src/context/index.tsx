import React from 'react'
import { Account, DDO, Nevermined, Bookmark } from '@nevermined-io/nevermined-sdk-js'

import { Bundle } from '../shared/api';

export const User = React.createContext({
    isLogged: false,
    bookmarks: [] as Bookmark[],
    userBundles: [] as Bundle[],
    balance: {
        eth: 0,
        nevermined: 0
    },
    network: '',
    tokenSymbol: '',
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
