import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import Web3 from 'web3'
import { Nevermined, Account, DDO, Profile, Bookmark  } from '@nevermined-io/nevermined-sdk-js'
import Catalog from '@nevermined-io/components-catalog'
import { User } from '.'
import { correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';

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
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
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
    const { loginMetamask, walletAddress, isAvailable, checkIsLogged, switchChainsOrRegisterSupportedChain } = useContext(Catalog.WalletContext)
    const prevBasket = useRef<string[]>()
    const userProviderMounted = useRef()

    useEffect(() => {
        if(isLoadingSDK || !network) {
            return
        }

        (async() => {
            if (userProviderMounted) {
                window?.ethereum?.on('accountsChanged', async () => {
                    fetchBalance()
                })
    
                window?.ethereum?.on('chainChanged', async (chainId: any) => {
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

    const reloadSdk = async() => {
        const config = {
            web3Provider: new Web3(window.ethereum),
            nodeUri: network,
            marketplaceUri,
            gatewayUri,
            faucetUri,
            gatewayAddress,
            secretStoreUri,
            verbose,
            marketplaceAuthToken: Catalog.fetchMarketplaceApiTokenFromLocalStorage().token || '',
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
            const account = (await sdk.accounts.list())?.find(a => a.getId() === walletAddress)

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
        }}>
            {props.children}
        </User.Provider>
    )
    
}

export default UserProvider