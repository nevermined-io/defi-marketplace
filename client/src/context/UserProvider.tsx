import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Catalog, AuthToken } from '@nevermined-io/catalog-core'
import { User } from '.'
import { correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';
import {SubscriptionTiers, UserSubscription } from '../shared/constants'
import { NFT_TIERS} from 'src/config'

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

const window = global.window || {} as any

interface UserProviderProps {
    children: ReactNode
}

const UserProvider = (props: UserProviderProps) => {
    const [ isLogged, setIsLogged ] = useState(false)
    const [bookmarks, setBookmarks] = useState<DDO[]>([])
    const [balance, setBalance] = useState<{eth: any, nevermined: any}>({
        eth: 0,
        nevermined: 0
    })
    const [userBundles, setUserBundles ] = useState<Bundle[]>([])
    const [network, setNetwork] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [basket, setBasket] = useState<string[]>([])
    const [assets, setAssets] = useState<DDO[]>([])
    const [searchInputText, setSearchInputText] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
    const [selectedPrice, setSelectedPrice] = useState<number>(0)
    const { sdk, updateSDK, isLoadingSDK } = Catalog.useNevermined()
    const { walletAddress, isAvailable, checkIsLogged } = useContext(MetaMask.WalletContext)
    const prevBasket = useRef<string[]>()
    const userProviderMounted = useRef()
    const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([])

    const getCurrentUserSubscription = () : UserSubscription | undefined => {
        return userSubscriptions.find((subs) => subs.current)
    }

    const checkSubscription = async (nftTierAddress: string): Promise<boolean> => {
        const nft721 = await sdk.contracts.loadNft721(nftTierAddress)
        const accounts = await sdk.accounts.list()
        const balance = await nft721.balanceOf(accounts[0])
        
        return balance.gt(0)
    }

    const getUserSubscriptions = async (): Promise<UserSubscription[]> => {
      
        const tier3 = NFT_TIERS.find(tier => tier.level === 3)
        const tier2 = NFT_TIERS.find(tier => tier.level === 2)
        const tier1 = NFT_TIERS.find(tier => tier.level === 1)
      
        // Check Tier3
        const isTier3 = await checkSubscription(tier3?.address || '')   
        if (isTier3){    
            return([
                {
                    tier: tier3!.name as SubscriptionTiers,
                    address: tier3!.address,
                    access: true,
                    current: true
                },
                {
                    tier: tier2!.name as SubscriptionTiers,
                    address: tier2!.address,
                    access: true,
                    current: false
                },
                {
                    tier: tier1!.name as SubscriptionTiers,
                    address: tier1!.address,
                    access: true,
                    current: false
                }
            ])
        }
        // Check Tier2
        const isTier2 = await checkSubscription(tier2?.address || '')
        if (isTier2){
            return([
                {
                    tier: tier3!.name as SubscriptionTiers,
                    address: tier3!.address,
                    access: false,
                    current: false
                },
                {
                    tier: tier2!.name as SubscriptionTiers,
                    address: tier2!.address,
                    access: true,
                    current: true
                },
                {
                    tier: tier1!.name as SubscriptionTiers,
                    address: tier1!.address,
                    access: true,
                    current: false
                }
            ])
        }  
        // Check Tier1
        const isTier1 = await checkSubscription(tier1?.address || '')
        if (isTier1){   
            return([
                {
                    tier: tier3!.name as SubscriptionTiers,
                    address: tier3!.address,
                    access: false,
                    current: false
                },
                {
                    tier: tier2!.name as SubscriptionTiers,
                    address: tier2!.address,
                    access: false,
                    current: false
                },
                {
                    tier: tier1!.name as SubscriptionTiers,
                    address: tier1!.address,
                    access: true,
                    current: true
                }
            ])
          }    
          return[]    
        }


    useEffect(() => {
        if(isLoadingSDK || !network) {
            return
        }

        (async() => {
            if (userProviderMounted) {
                window?.ethereum?.on('accountsChanged', async () => {
                    fetchBalance()
                })
    
                window?.ethereum?.on('chainChanged', async () => {
                    await reloadSdk()
                })
            }
        })()
    }, [isLoadingSDK, network])

    useEffect(() => {
        const sdkHandler = async() => {
            const networkState = await sdk?.keeper?.getNetworkName();
            if(networkState) setNetwork(networkState)
            await loadNevermined()
        };

        sdkHandler()
    }, [sdk])

    useEffect(() => {
        if(!isAvailable()) {
          setIsLogged(false)
          return
        }
    
        (async () => {
          const isLoggedState = await checkIsLogged()
          setIsLogged(isLoggedState)
          if(isLoggedState) {
            await loadNevermined()
          }
        })()
      }, [walletAddress])

    useEffect(() => {
        prevBasket.current = basket
        
    }, [basket])


    useEffect(() => {
    
        if(!isAvailable()) {
          setIsLogged(false)
          return
        }
        if(isLoadingSDK ) {
            return
        }

        (async () => {
           const userSubs = await getUserSubscriptions()
           setUserSubscriptions(userSubs)     
        })()
      }, [walletAddress, isLoadingSDK])

    const reloadSdk = async() => {
        const config = {
            web3Provider: window.ethereum,
            nodeUri: network,
            marketplaceUri,
            gatewayUri,
            faucetUri,
            gatewayAddress,
            secretStoreUri,
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
        
        const network = await sdk?.keeper?.getNetworkName();
        await fetchBalance()
        await fetchAllUserBundlers(walletAddress)
        if (network === correctNetworkName) {
            fetchTokenSymbol()
        }
    }

    const fetchBalance = async () => {
        try {
            const account = (await sdk.accounts?.list())?.find(a => a.getId() === walletAddress)

            if (account) {
                const balance = await account.getBalance()
                const { eth, nevermined } = balance
                if (eth !== balance.eth || nevermined !== balance.nevermined) {
                    setBalance({eth, nevermined})
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAllUserBundlers = async (account: string) => {

        if (account) {
            const bundles = await getAllUserBundlers(account)
            setUserBundles(bundles)
        }
    }

    const addToBasket = (dids: string[]) => {
        setBasket([...basket.concat(...dids.filter(did => !basket.includes(did)))])
    }

    const removeFromBasket = (dids: string[]): string[] => {
        const didsSet = new Set(dids)
        setBasket([...prevBasket.current?.filter(did => !didsSet.has(did)) as string[]])
        return basket
    }


    const setSelectedPriceRange = (selectedPrice: number) => {
        setSelectedPrice(selectedPrice)
    }

    return (
        <User.Provider value={{
            isLogged,
            bookmarks, 
            setBookmarks,
            balance,
            userBundles,
            network,
            tokenSymbol,
            basket,
            assets, setAssets,
            searchInputText, setSearchInputText,
            fromDate, setFromDate,
            toDate, setToDate,
            selectedCategories, setSelectedCategories,
            selectedNetworks, setSelectedNetworks,
            selectedPrice,
            addToBasket: (dids: string[]) => addToBasket(dids),
            removeFromBasket: (dids: string[]) => removeFromBasket(dids),
            setSelectedPriceRange: (selectedPrice: number) => setSelectedPriceRange(selectedPrice),
            setAllUserBundles: (account: string): Promise<void> => fetchAllUserBundlers(account),
            getCurrentUserSubscription,
            userSubscriptions, setUserSubscriptions,
            getUserSubscriptions
        }}>
            {props.children}
        </User.Provider>
    )
    
}

export default UserProvider