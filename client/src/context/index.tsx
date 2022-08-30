import React from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { Bundle } from '../shared/api';
import { UserSubscription } from '../shared/constants'

export const User = React.createContext({
    isLogged: false,
    bookmarks: [] as DDO[],
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
    setBookmarks: (bookmarks: DDO[]) => {
        /* empty */
    },
    userSubscriptions: [] as UserSubscription[],
    setUserSubscriptions: (userSubscriptions: UserSubscription[]) => {
         /* empty */
    },
    getCurrentUserSubscription: () : UserSubscription | undefined => {
        return 
    },
    getUserSubscriptions: () : Promise<UserSubscription[]>  | undefined  => {
        return
    }
})