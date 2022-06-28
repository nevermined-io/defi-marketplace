import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import Web3 from 'web3'
import { Nevermined, Account, DDO, Profile, Bookmark, State } from '@nevermined-io/nevermined-sdk-js'
import Catalog from '@nevermined-io/components-catalog'
import { User } from '.'
import MarketProvider from './MarketProvider'
import { MetamaskProvider } from './MetamaskProvider'
import { correctNetworkId, correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';

import {
    nodeUri,
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
    const [userProfile, setUserProfile ] = useState<Profile>({
        nickname: '',
        userId: '',
        isListed: false,
        addresses: [],
        state: State.Disabled
    })
    const [network, setNetwork] = useState('')
    const [web3, setWeb3] = useState<Web3>(DEFAULT_WEB3)
    const [account, setAccount] = useState('')
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
    const { sdk, isLoadingSDK } = useContext(Catalog.NeverminedContext)
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
                    fetchAccounts()
                })
        
                window?.ethereum?.on('chainChanged', async () => {
                    //not sure if fetchNetwork makes sense.
                    //chainChanged event has chainId as a parameter.
                    await fetchNetwork()
                })
            } else {
                await bootstrap()
                window?.ethereum?.on('accountsChanged', async () => {
                    fetchAccounts()
                })

                window?.ethereum?.on('chainChanged', async (chainId: any) => {
                    if (chainId === correctNetworkId) {
                        const metamaskProvider = new MetamaskProvider()
                        await metamaskProvider.switchChain()
                        getProviderAndLoadNevermined(metamaskProvider)
                    } else {
                        loadNevermined()
                    }

                })
            }

        })()
    }, [isLoadingSDK])

    useEffect(() => {
        prevBasket.current = basket
        
    }, [basket])

    const loginMetamask = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        }

        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.startLogin()
        getProviderAndLoadNevermined(metamaskProvider)
    }

    const getProviderAndLoadNevermined = (metamaskProvider: any) => {
        const web3 = metamaskProvider.getProvider()
        setIslogged(true)
        setIsBurner(false)
        setWeb3(web3)
        loadNevermined()
    }

    const switchToCorrectNetwork = async () => {
        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.switchChain()
        getProviderAndLoadNevermined(metamaskProvider)
    }

    let accountsInterval: any = null

    let networkInterval: any = null

    const initAccountsPoll = (): void => {
        if (!accountsInterval) {
            accountsInterval = setInterval(
                fetchAccounts,
                POLL_ACCOUNTS
            )
        }
    }

    const initNetworkPoll = (): void => {
        if (!networkInterval) {
            networkInterval = setInterval(fetchNetwork, POLL_NETWORK)
        }
    }

    const loadDefaultWeb3 = async (): Promise<void> => {
        setIslogged(true)
        setIsBurner(true)
        setWeb3(DEFAULT_WEB3)
        loadNevermined()
    }

    const fetchTokenSymbol = async (): Promise<void> => {
        let tokenSymbolState = 'Unknown'
        if (sdk.keeper && sdk.keeper.token) {
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
        window?.ethereum?.on('accountsChanged', async (accounts: string[]) => {
            await fetchUserProfile(accounts[0])      
        })

        setIsLoading(false)
        const network = await sdk.keeper?.getNetworkName();
        initNetworkPoll()
        initAccountsPoll()
        fetchNetwork()
        await fetchAccounts()
        await fetchAllUserBundlers(account)
        await fetchUserProfile(account)
        if (network === correctNetworkName) {
            fetchTokenSymbol()
        }
    
    }

    const bootstrap = async (): Promise<void> => {
        const logType = localStorage.getItem('logType')
        const metamaskProvider = new MetamaskProvider()

        if (
            (await metamaskProvider.isAvailable()) &&
            (await metamaskProvider.isLogged())
        ) {
            const web3 = metamaskProvider.getProvider()
            setIslogged(true)
            setWeb3(web3)
            loadNevermined()
                
            
        } else {
            loadDefaultWeb3()
        }         
    }

    const fetchAccounts = async () => {
        if (isLogged) {
            let accounts

            // Modern dapp browsers
            if (window.ethereum && !isLogged) {
                // simply set to empty, and have user click a button somewhere
                // to initiate account unlocking
                accounts = []

                // alternatively, automatically prompt for account unlocking
                // await unlockAccounts()
            }

            console.log(sdk)
            accounts = await sdk.accounts.list()

            if (accounts.length) {
                const account = await accounts[0].getId()

                if (account !== account) {
                    if(!localStorage.getItem('marketplaceApiToken'))
                    marketplaceLogin(sdk, accounts[0])

                    setAccount(account)
                    setIslogged(true)
                    // requestFromFaucet: async () => { }

                    await fetchBalance(accounts[0])
                }
            } else {
                if(!isLogged) {
                    setIslogged(false)
                    setAccount('')
                }
            }
        }
    }

    const fetchBalance = async (account: Account) => {
        try {
            const balance = await account.getBalance()
            const { eth, nevermined } = balance
            if (eth !== balance.eth || nevermined !== balance.nevermined) {
                setBalance({eth, nevermined})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNetwork = async () => {
        let networkState = 'Unknown'
        if (sdk.keeper) {
            networkState = await sdk.keeper.getNetworkName()
        }
        network !== networkState && setNetwork(network)
    }

    const fetchUserProfile = async (address: string): Promise<void> => {

        try {
            const userProfileState = await sdk.profiles.findOneByAddress(address)
            setUserProfile(userProfile)
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
            account,
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
            switchToCorrectNetwork: (): Promise<any> => switchToCorrectNetwork(),
        }}>
            <MarketProvider nevermined={sdk}>
                {props.children}
            </MarketProvider>
        </User.Provider>
    )
    
}

export default UserProvider