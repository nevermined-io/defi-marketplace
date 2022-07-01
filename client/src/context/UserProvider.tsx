import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import Web3 from 'web3'
import { Nevermined, Account, DDO, Profile, Bookmark, State } from '@nevermined-io/nevermined-sdk-js'
import Catalog from 'components-catalog-nvm-test'
import { User } from '.'
import { correctNetworkId, correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';

import {
    gatewayUri,
    marketplaceUri,
    gatewayAddress,
    faucetUri,
    nodeUri,
    secretStoreUri,
    verbose,
    graphUrl,
    artifactsFolder
} from '../config'

const window = global.window || {} as any


const POLL_ACCOUNTS = 1000 // every 1s
const POLL_NETWORK = POLL_ACCOUNTS * 60 // every 1 min
const DEFAULT_WEB3 = new Web3(new Web3.providers.HttpProvider(nodeUri)) // default web3

interface UserProviderProps {
    children: ReactNode
}

const UserProvider = (props: UserProviderProps) => {
    const [ isLogged, setIslogged ] = useState(false)
    const [ isBurner, setIsBurner ] = useState(false)
    const [ isWeb3Capable, setWeb3Capable ] = useState(Boolean((window as any).web3 || (window as any).ethereum))
    const [ isLoading, setIsLoading ] = useState(true)
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [balance, setBalance] = useState<{eth: any, nevermined: any}>({
        eth: 0,
        nevermined: 0
    })
    const [userBundles, setUserBundles ] = useState<Bundle[]>([])
    const [userProfile, setUserProfile ] = useState<Profile>({} as Profile)
    const [network, setNetwork] = useState('')
    const [web3, setWeb3] = useState<Web3>(DEFAULT_WEB3)
    const [message, setMessage] = useState('Connecting to Autonomies...')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [tokenDecimals, setTokenDecimals] = useState<number>(6)
    const [basket, setBasket] = useState<string[]>([])
    const [assets, setAssets] = useState<DDO[]>([])
    const [searchInputText, setSearchInputText] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
    const [selectedPrice, setSelectedPrice] = useState<number>(0)
    const { sdk, updateSDK, isLoadingSDK } = useContext(Catalog.NeverminedContext)
    const { loginMetamask, walletAddress, getProvider, isAvailable, checkIsLogged, switchChainsOrRegisterSupportedChain } = useContext(Catalog.WalletContext)
    const prevBasket = useRef<string[]>()
    const userProviderMounted = useRef()

        // addToBasket: (dids: string[]) => this.addToBasket(dids),
        // removeFromBasket: (dids: string[]) => this.removeFromBasket(dids),
        // setSelectedNetworks: (selectedNetworks: string[]) => this.setSelectedNetworks(selectedNetworks),
        // setSelectedPriceRange: (selectedPrice: number) => this.setSelectedPriceRange(selectedPrice),
        // setAllUserBundles: (account: string): Promise<void> => this.fetchAllUserBundlers(account),
        // setBookmarks: (bookmarks: Bookmark[]): void => this.setBookmarks(bookmarks)

        useEffect(() => {
            if(!isLoadingSDK) {
                return
            }
    
            (async() => {
                if (!userProviderMounted) {
                    window?.ethereum?.on('accountsChanged', async () => {
                        fetchBalance()
                    })
            
                    window?.ethereum?.on('chainChanged', async () => {
                        //not sure if fetchNetwork makes sense.
                        //chainChanged event has chainId as a parameter.
                        await fetchNetwork()
                    })
                } else {
                    await bootstrap()
    
                    window?.ethereum?.on('chainChanged', async (chainId: any) => {
                        loadNevermined()
                    })
                }
    
            })()
        }, [isLoadingSDK])

    useEffect(() => {
        prevBasket.current = basket
        
    }, [basket])

    let networkInterval: any = null

    const initNetworkPoll = (): void => {
        if (!networkInterval) {
            networkInterval = setInterval(fetchNetwork, POLL_NETWORK)
        }
    }

    const reloadSdk = async() => {
        const config = {
            web3Provider: getProvider(),
            nodeUri: network,
            marketplaceUri,
            gatewayUri,
            faucetUri,
            gatewayAddress,
            secretStoreUri,
            verbose,
            marketplaceAuthToken: localStorage.getItem('marketplaceApiToken') || '',
            artifactsFolder,
            graphHttpUri: graphUrl
        }

        updateSDK(config)
    } 

    const loadDefaultWeb3 = async (): Promise<void> => {
        setIslogged(true)
        setIsBurner(true)
        setWeb3(DEFAULT_WEB3)
        loadNevermined()
    }

    const fetchTokenSymbol = async (): Promise<void> => {
        let tokenSymbolState = 'Unknown'
        if (sdk?.keeper && sdk.keeper.token) {
            tokenSymbolState = await sdk.token.getSymbol()
        }
        tokenSymbol !== tokenSymbol && setTokenSymbol(tokenSymbolState)
    }

    const marketplaceLogin = async(sdk: Nevermined, account: Account): Promise<void> => {
        let credential = await sdk.utils.jwt.generateClientAssertion(account)

        const token = await sdk.marketplace.login(credential)

        localStorage.setItem('marketplaceApiToken', token)
    }

    const loadNevermined = async (): Promise<void> => {
        await reloadSdk()
        window?.ethereum?.on('accountsChanged', async (accounts: string[]) => {
            await fetchUserProfile(accounts[0])      
        })

        setIsLoading(false)
        const network = await sdk?.keeper?.getNetworkName();
        initNetworkPoll()
        await fetchNetwork()
        await fetchBalance()
        await fetchAllUserBundlers(walletAddress)
        await fetchUserProfile(walletAddress)
        if (network === correctNetworkName) {
            fetchTokenSymbol()
        }
    
    }

    const bootstrap = async (): Promise<void> => {
        const logType = localStorage.getItem('logType')

        if (
            (isAvailable()) &&
            (await checkIsLogged())
        ) {
            const web3 = getProvider()
            setIslogged(true)
            setWeb3(web3)
            loadNevermined()
                
            
        } else {
            loadDefaultWeb3()
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

    const fetchNetwork = async () => {
        let networkState = 'Unknown'
        if (sdk?.keeper) {
            networkState = await sdk.keeper.getNetworkName()
        }
        if(network !== networkState) setNetwork(network)
    }

    const fetchUserProfile = async (address: string): Promise<void> => {

        try {
            const userProfileState = await sdk?.profiles.findOneByAddress(address)
            setUserProfile(userProfileState)
        } catch (error: any) {
            console.error(error.message)
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
            isBurner,
            isWeb3Capable,
            isLoading,
            bookmarks, setBookmarks,
            balance,
            userBundles,
            userProfile,
            network,
            web3,
            sdk,
            walletAddress,
            message,
            tokenSymbol,
            tokenDecimals,
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
            loginMetamask: (): Promise<any> => loginMetamask(),
            loginMarketplaceAPI: (sdk: Nevermined, account: Account): Promise<void> => marketplaceLogin(sdk, account),
            switchToCorrectNetwork: (): Promise<any> => switchChainsOrRegisterSupportedChain(),
        }}>
            {props.children}
        </User.Provider>
    )
    
}

export default UserProvider