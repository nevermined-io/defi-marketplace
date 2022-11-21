import React, { useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { useWallet } from '@nevermined-io/catalog-providers'
import { Catalog, AuthToken } from '@nevermined-io/catalog-core'
import { User, DropDownFilters } from '.'
import { correctNetworkName } from '../config'
import { SubscriptionTiers, UserSubscription } from '../shared/constants'
import { NFT_TIERS } from 'src/config'
import { Config } from '@nevermined-io/catalog-core'

import {
  gatewayUri,
  marketplaceUri,
  gatewayAddress,
  faucetUri,
  secretStoreUri,
  verbose,
  graphUrl,
  artifactsFolder
} from '../config'

const window = global.window || ({} as any)

interface UserProviderProps {
  children: ReactNode
}

const tiers = [
  {
    name: 'Community',
    price: '0',
    symbol: 'USDC',
    features: [
      'On-chain normalized data from different protocols and networks',
      'Insights dashboards',
      'Integration of basic data with Google Data Studio',
      'Publish reports and notebooks/algorithms without monetization free for the community',
      'Access to community reports'
    ],
    enabled: true
  },
  {
    name: 'Analyst',
    price: '50',
    symbol: 'USDC',
    features: [
      'Tier 1 + Enriched and aggregated datasets',
      'Advanced dashboards',
      'Integration of aggregated data with Google Data Studio',
      'Monetization of reports and notebooks/algorithms',
      'Access to tier 2 reports'
    ],
    enabled: false
  },
  {
    name: 'Enterprise',
    price: '500',
    symbol: 'USDC',
    features: [
      'Tier 2 + Insights and AI on top of the on-chain data',
      'Full access to insights dashboards',
      'Integration of insights reports with Google Data Studio',
      'Monetization of reports and notebooks/algorithms',
      'Access to tier 2 and tier 3 reports'
    ],
    enabled: false
  }
]

const UserProvider = (props: UserProviderProps) => {
  const [isLogged, setIsLogged] = useState(false)
  const [bookmarks, setBookmarks] = useState<DDO[]>([])
  const [balance, setBalance] = useState<{ eth: any; nevermined: any }>({
    eth: 0,
    nevermined: 0
  })
  const [network, setNetwork] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [assets, setAssets] = useState<DDO[]>([])
  const [searchInputText, setSearchInputText] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([])
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<number>(0)
  const { sdk, updateSDK, isLoadingSDK } = Catalog.useNevermined()
  const { walletAddress, getStatus} = useWallet()
  const userProviderMounted = useRef()
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([])
  const [userSubscriptionsStatus, setUserSubscriptionsStatus] = useState({
    isLoading: false,
    hasLoaded: false
  })
  const [dropdownFilters, setDropDownFilters] = useState<DropDownFilters>({
    selectedNetworks: [],
    selectedSubscriptions: [],
    selectedSubtypes: [],
    fromDate: '',
    toDate: ''
  })

  const getCurrentUserSubscription = (): UserSubscription | undefined => {
    return userSubscriptions.find((subs) => subs.current)
  }

  const checkSubscription = async (nftTierAddress: string): Promise<boolean> => {
    const accounts = await sdk.accounts.list()
    if (!accounts[0]) return false

    const nft721 = await sdk.contracts.loadNft721(nftTierAddress)
    const balance = await nft721.balanceOf(accounts[0])
    return balance.gt(0)
  }

  const getUserSubscriptions = async (): Promise<UserSubscription[]> => {
    const tier3 = NFT_TIERS.find((tier) => tier.level === 3)
    const tier2 = NFT_TIERS.find((tier) => tier.level === 2)
    const tier1 = NFT_TIERS.find((tier) => tier.level === 1)

    // Check Tier3
    const isTier3 = await checkSubscription(tier3?.address || '')
    if (isTier3) {
      return [
        {
          tier: tier3!.name as SubscriptionTiers,
          address: tier3!.address,
          did: tier3!.did,
          access: true,
          current: true
        },
        {
          tier: tier2!.name as SubscriptionTiers,
          address: tier2!.address,
          did: tier2!.did,
          access: true,
          current: false
        },
        {
          tier: tier1!.name as SubscriptionTiers,
          address: tier1!.address,
          did: tier1!.did,
          access: true,
          current: false
        }
      ]
    }
    // Check Tier2
    const isTier2 = await checkSubscription(tier2?.address || '')
    if (isTier2) {
      return [
        {
          tier: tier3!.name as SubscriptionTiers,
          address: tier3!.address,
          did: tier3!.did,
          access: false,
          current: false
        },
        {
          tier: tier2!.name as SubscriptionTiers,
          address: tier2!.address,
          did: tier2!.did,
          access: true,
          current: true
        },
        {
          tier: tier1!.name as SubscriptionTiers,
          address: tier1!.address,
          did: tier1!.did,
          access: true,
          current: false
        }
      ]
    }
    // Check Tier1
    const isTier1 = await checkSubscription(tier1?.address || '')
    if (isTier1) {
      return [
        {
          tier: tier3!.name as SubscriptionTiers,
          address: tier3!.address,
          did: tier3!.did,
          access: false,
          current: false
        },
        {
          tier: tier2!.name as SubscriptionTiers,
          address: tier2!.address,
          did: tier2!.did,
          access: false,
          current: false
        },
        {
          tier: tier1!.name as SubscriptionTiers,
          address: tier1!.address,
          did: tier1!.did,
          access: true,
          current: true
        }
      ]
    }
    return []
  }

  useEffect(() => {
    if (isLoadingSDK || !network) {
      return
    }

    (async () => {
      if (userProviderMounted) {
        window?.ethereum?.on?.('accountsChanged', async () => {
          fetchBalance()
        })

        window?.ethereum?.on?.('chainChanged', async () => {
          await reloadSdk()
        })
      }
    })()
  }, [isLoadingSDK, network])

  useEffect(() => {
    const sdkHandler = async () => {
      const networkState = await sdk?.keeper?.getNetworkName()
      if (networkState) setNetwork(networkState)
      await loadNevermined()
    }

    sdkHandler()
  }, [sdk])

  useEffect(() => {
    if (getStatus() === 'disconnected' ) {
      setIsLogged(false)
      return
    }

    (async () => {
      const isLoggedState = await getStatus()
      setIsLogged(isLoggedState === 'connected')
      if (isLoggedState) {
        await loadNevermined()
      }
    })()
  }, [walletAddress])

  useEffect(() => {
    if (getStatus() === 'disconnected' ) {
      setIsLogged(false)
      return
    }
    if (isLoadingSDK) {
      return
    }

    (async () => {
      setUserSubscriptionsStatus((prev) => ({ ...prev, isLoading: true }))
      const userSubs = await getUserSubscriptions()
      setUserSubscriptions(userSubs)
      setUserSubscriptionsStatus((prev) => ({ ...prev, isLoading: false, hasLoaded: true }))
    })()
  }, [walletAddress, isLoadingSDK])

  const reloadSdk = async () => {
    const config: Config = {
      web3Provider: window.ethereum,
      web3ProviderUri: network,
      marketplaceUri,
      neverminedNodeUri: gatewayUri,
      faucetUri,
      neverminedNodeAddress: gatewayAddress,
      verbose,
      marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token || '',
      artifactsFolder,
      graphHttpUri: graphUrl
    }

    updateSDK(config)
  }

  const fetchTokenSymbol = async (): Promise<void> => {
    let tokenSymbolState = 'Unknown'
    if (sdk?.keeper && sdk.keeper.token) {
      tokenSymbolState = await sdk.token.getSymbol()
    }
    tokenSymbol !== tokenSymbol && setTokenSymbol(tokenSymbolState)
  }

  const loadNevermined = async (): Promise<void> => {
    const network = await sdk?.keeper?.getNetworkName()
    await fetchBalance()
    if (network === correctNetworkName) {
      fetchTokenSymbol()
    }
  }

  const fetchBalance = async () => {
    try {
      const account = (await sdk.accounts?.list())?.find((a) => a.getId() === walletAddress)

      if (account) {
        const balance = await account.getBalance()
        const { eth, nevermined } = balance
        if (eth !== balance.eth || nevermined !== balance.nevermined) {
          setBalance({ eth, nevermined })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setSelectedPriceRange = (selectedPrice: number) => {
    setSelectedPrice(selectedPrice)
  }

  const applyDropdownFilters = useCallback(() => {
    setDropDownFilters({
      selectedNetworks,
      selectedSubscriptions,
      selectedSubtypes,
      fromDate,
      toDate
    })
  }, [selectedNetworks, selectedSubscriptions, selectedSubtypes, fromDate, toDate])

  const clearDropdownFilters = useCallback(() => {
    const dropdownFilters = {
      selectedNetworks: [],
      selectedSubscriptions: [],
      selectedSubtypes: [],
      fromDate: '',
      toDate: ''
    }
    setSelectedNetworks(dropdownFilters.selectedNetworks)
    setSelectedSubscriptions(dropdownFilters.selectedSubscriptions)
    setSelectedSubtypes(dropdownFilters.selectedSubtypes)
    setFromDate(dropdownFilters.fromDate)
    setToDate(dropdownFilters.toDate)
    setDropDownFilters(dropdownFilters)
  }, [])

  return (
    <User.Provider
      value={{
        isLogged,
        bookmarks,
        setBookmarks,
        balance,
        network,
        tiers,
        tokenSymbol,
        assets,
        setAssets,
        searchInputText,
        setSearchInputText,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        selectedCategories,
        setSelectedCategories,
        selectedNetworks,
        setSelectedNetworks,
        selectedPrice,
        setSelectedPriceRange: (selectedPrice: number) => setSelectedPriceRange(selectedPrice),
        selectedSubscriptions,
        setSelectedSubscriptions,
        selectedSubtypes,
        setSelectedSubtypes,
        getCurrentUserSubscription,
        userSubscriptions,
        userSubscriptionsStatus,
        setUserSubscriptions,
        getUserSubscriptions,
        dropdownFilters,
        applyDropdownFilters,
        clearDropdownFilters
      }}
    >
      {props.children}
    </User.Provider>
  )
}

export default UserProvider
