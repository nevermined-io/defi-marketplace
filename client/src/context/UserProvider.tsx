import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Catalog, AuthToken } from '@nevermined-io/catalog-core'
import { User } from '.'
import { correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';
import { DID_NFT_TIERS} from 'src/config'


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
    const [accessSubscriptionTier1, setAccessSubscriptionTier1] = useState<boolean>(false)
    const [accessSubscriptionTier2, setAccessSubscriptionTier2] = useState<boolean>(false)
    const [accessSubscriptionTier3, setAccessSubscriptionTier3] = useState<boolean>(false)
    const [userSubscriptionTier, setUserSubscriptionTier] = useState<string>('') 

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

            setAccessSubscriptionTier3(false) 
            setAccessSubscriptionTier2(false) 
            setAccessSubscriptionTier1(false) 
            setUserSubscriptionTier("")
           // Check Tier3
            const tier3Address = DID_NFT_TIERS.find(tier => tier.name === "Enterprise")?.address || ''
            const isTier3 = await checkSubscription(tier3Address)
            if (isTier3){
             setAccessSubscriptionTier3(true) 
             setAccessSubscriptionTier2(true) 
             setAccessSubscriptionTier1(true) 
             setUserSubscriptionTier("Enterprise")
             return
            }
            // Check Tier2
            const tier2Address = DID_NFT_TIERS.find(tier => tier.name === "Analyst")?.address || ''
            const isTier2 = await checkSubscription(tier2Address)
            if (isTier2){
                setAccessSubscriptionTier3(false)
                setAccessSubscriptionTier2(true) 
                setAccessSubscriptionTier1(true) 
                setUserSubscriptionTier("Analyst")
                return
            }  
            // Check Tier1
            const tier1Address = DID_NFT_TIERS.find(tier => tier.name === "Community")?.address || ''
            const isTier1 = await checkSubscription(tier1Address)
            if (isTier1){
                setAccessSubscriptionTier3(false)
                setAccessSubscriptionTier2(false) 
                setAccessSubscriptionTier1(true) 
                setUserSubscriptionTier("Community")
            }
        })()
      }, [walletAddress, isLoadingSDK])

    
    const checkSubscription = async (nftTierAddress: string): Promise<boolean> => {
        const nft721 = await sdk.contracts.loadNft721(nftTierAddress)
        const accounts = await sdk.accounts.list()
        const balance = await nft721.balanceOf(accounts[0])
        
        return balance.gt(0)
    }

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
            console.log(error)
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
            accessSubscriptionTier1, setAccessSubscriptionTier1,
            accessSubscriptionTier2, setAccessSubscriptionTier2,
            accessSubscriptionTier3, setAccessSubscriptionTier3,
            userSubscriptionTier, setUserSubscriptionTier,
        }}>
            {props.children}
        </User.Provider>
    )
    
}

export default UserProvider