import React from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { UserSubscription } from '../shared/constants'

export const User = React.createContext({
    isLogged: false,
    bookmarks: [] as DDO[],
    balance: {
        eth: 0,
        nevermined: 0
    },
    network: '',
    tokenSymbol: '',
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