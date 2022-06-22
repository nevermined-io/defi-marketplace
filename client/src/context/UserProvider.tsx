import React, { PureComponent, } from 'react'
import Web3 from 'web3'
import { Nevermined, Account, DDO, Profile, Bookmark } from '@nevermined-io/nevermined-sdk-js'
import { User } from '.'
import MarketProvider from './MarketProvider'
import { MetamaskProvider } from './MetamaskProvider'
import { BurnerWalletProvider } from './BurnerWalletProvider'
import { correctNetworkId, correctNetworkName } from '../config';
import { getAllUserBundlers, Bundle } from '../shared/api';

import {
    marketplaceUri,
    gatewayAddress,
    faucetUri,
    nodeUri,
    secretStoreUri,
    verbose,
    graphUrl,
    artifactsFolder
} from '../config'

import {gatewayUrl} from '../../next.config'


export async function provideNevermined(web3Provider: Web3): Promise<{sdk: Nevermined}> {

    const gatewayUri = gatewayUrl  
      
    const config = {
        web3Provider,
        nodeUri,
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
    const sdk: Nevermined = await Nevermined.getInstance(config)

    return { sdk }
}

const window = global.window || {} as any


const POLL_ACCOUNTS = 1000 // every 1s
const POLL_NETWORK = POLL_ACCOUNTS * 60 // every 1 min
const DEFAULT_WEB3 = new Web3(new Web3.providers.HttpProvider(nodeUri)) // default web3

interface UserProviderState {
    isLogged: boolean
    isBurner: boolean
    isWeb3Capable: boolean
    isLoading: boolean
    account: string
    userProfile: Profile
    bookmarks: Bookmark[]
    balance: {
        eth: number
        nevermined: number
    }
    network: string
    web3: Web3
    sdk: Nevermined
    userBundles: Bundle[]
    requestFromFaucet(account: string): Promise<any>
    loginMetamask(): Promise<any>
    loginBurnerWallet(): Promise<any>
    logoutBurnerWallet(): Promise<any>
    loginMarketPlaceApi(sdk: Nevermined, account: Account): Promise<void>
    switchToCorrectNetwork(): Promise<any>
    // addToBasket(dids: string[]): string[],
    message: string
    tokenSymbol: string
    basket: string[]
    assets: DDO[],
    searchInputText: string,
    fromDate: string,
    toDate: string,
    selectedCategories: string[]
    selectedNetworks: string[]
    selectedPrice: number
    setAllUserBundles(): Promise<void>
    setBookmark(userId: string): Promise<void> 
}

export default class UserProvider extends PureComponent<{}, UserProviderState> {
    public componentDidUpdate() {
        window?.ethereum?.on('accountsChanged', async (accounts) => {
            this.fetchAccounts()
        })

        window?.ethereum?.on('chainChanged', async (accounts) => {
            //not sure if fetchNetwork makes sense.
            //chainChanged event has chainId as a parameter.
            await this.fetchNetwork()
        })

    }

    private loginMetamask = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        }

        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.startLogin()
        this.getProviderAndLoadNevermined(metamaskProvider)
    }

    private getProviderAndLoadNevermined = (metamaskProvider: any) => {
        const web3 = metamaskProvider.getProvider()
        this.setState(
            {
                isLogged: true,
                isBurner: false,
                web3
            },
            () => {
                this.loadNevermined()
            }
        )
    }

    private switchToCorrectNetwork = async () => {
        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.switchChain()
        this.getProviderAndLoadNevermined(metamaskProvider)
    }

    private loginBurnerWallet = async () => {
        const burnerwalletProvider = new BurnerWalletProvider()
        await burnerwalletProvider.startLogin()
        const web3 = burnerwalletProvider.getProvider()
        this.setState(
            {
                isLogged: true,
                isBurner: true,
                web3
            },
            () => {
                this.loadNevermined()
            }
        )
    }

    private logoutBurnerWallet = async () => {
        const burnerwalletProvider = new BurnerWalletProvider()
        await burnerwalletProvider.logout()
    }

    public state = {
        isLogged: false,
        isBurner: false,
        isWeb3Capable: Boolean(window.web3 || window.ethereum),
        isLoading: true,
        bookmarks: [],
        balance: {
            eth: 0,
            nevermined: 0
        },
        userBundles: [],
        userProfile: {},
        network: '',
        web3: DEFAULT_WEB3,
        account: '',
        sdk: {} as Nevermined,
        requestFromFaucet: (): Promise<FaucetResponse> => requestFromFaucet(''),
        loginMetamask: (): Promise<any> => this.loginMetamask(),
        loginBurnerWallet: (): Promise<any> => this.loginBurnerWallet(),
        logoutBurnerWallet: (): Promise<any> => this.logoutBurnerWallet(),
        loginMarketplaceAPI: (sdk: Nevermined, account: Account): Promise<void> => this.marketplaceLogin(sdk, account),
        switchToCorrectNetwork: (): Promise<any> => this.switchToCorrectNetwork(),
        message: 'Connecting to Autonomies...',
        tokenSymbol: '',
        tokenDecimals: 6,
        basket: [] as string[],
        addToBasket: (dids: string[]) => this.addToBasket(dids),
        removeFromBasket: (dids: string[]) => this.removeFromBasket(dids),
        assets: [],
        setAssets: (assets: DDO[]) => this.setAssets(assets),
        searchInputText: '',
        setSearchInputText: (searchInputText: string) => this.setSearchInputText(searchInputText),
        fromDate: '',
        setFromDate: (fromDate: string) => this.setFromDate(fromDate),
        toDate: '',
        setToDate: (toDate: string) => this.setToDate(toDate),
        selectedCategories: [] as string[],
        setSelectedCategories: (selectedCategories: string[]) => this.setSelectedCategories(selectedCategories),
        selectedNetworks: [] as string[],
        setSelectedNetworks: (selectedNetworks: string[]) => this.setSelectedNetworks(selectedNetworks),
        setSelectedPriceRange: (selectedPrice: number) => this.setSelectedPriceRange(selectedPrice),
        setAllUserBundles: (account: string): Promise<void> => this.fetchAllUserBundlers(account),
        setBookmarks: (bookmarks: Bookmark[]): void => this.setBookmarks(bookmarks) 
    }

    private accountsInterval: any = null

    private networkInterval: any = null

    public async componentDidMount() {
        await this.bootstrap()

        //needed to automatically load the asset details when the network is changed to the correct one
        window?.ethereum?.on('chainChanged', async (chainId: any) => {
            if (chainId === correctNetworkId) {
                const metamaskProvider = new MetamaskProvider()
                await metamaskProvider.switchChain()
                this.getProviderAndLoadNevermined(metamaskProvider)
            } else {
                this.loadNevermined()
            }

        })
    }

    private initAccountsPoll(): void {
        if (!this.accountsInterval) {
            this.accountsInterval = setInterval(
                this.fetchAccounts,
                POLL_ACCOUNTS
            )
        }
    }

    private initNetworkPoll(): void {
        if (!this.networkInterval) {
            this.networkInterval = setInterval(this.fetchNetwork, POLL_NETWORK)
        }
    }

    private loadDefaultWeb3 = async (): Promise<void> => {
        this.setState(
            {
                isLogged: false,
                isBurner: false,
                web3: DEFAULT_WEB3
            },
            () => {
                this.loadNevermined()
            }
        )
    }

    private fetchTokenSymbol = async (): Promise<void> => {
        const { sdk } = this.state
        let tokenSymbol = 'Unknown'
        if (sdk.keeper && sdk.keeper.token) {
            tokenSymbol = await sdk.token.getSymbol()
        }
        tokenSymbol !== this.state.tokenSymbol && this.setState({ tokenSymbol })
    }

    private marketplaceLogin = async(sdk: Nevermined, account: Account): Promise<void> => {
        let credential = await sdk.utils.jwt.generateClientAssertion(account)

        const token = await sdk.marketplace.login(credential)

        localStorage.setItem('marketplaceApiToken', token)
    }

    private loadNevermined = async (): Promise<void> => {
        const { sdk } = await provideNevermined(this.state.web3);

        (window as any)?.ethereum?.on('accountsChanged', async (accounts: string[]) => {
            await this.fetchUserProfile(accounts[0])      
        })

        this.setState({ sdk, isLoading: false }, async () => {
            const network = await sdk.keeper?.getNetworkName();
            this.initNetworkPoll()
            this.initAccountsPoll()
            this.fetchNetwork()
            await this.fetchAccounts()
            await this.fetchAllUserBundlers(this.state.account)
            await this.fetchUserProfile(this.state.account)
            if (network === correctNetworkName) {
                this.fetchTokenSymbol()
            }
        })
    }

    private bootstrap = async (): Promise<void> => {
        const logType = localStorage.getItem('logType')
        const metamaskProvider = new MetamaskProvider()

        switch (logType) {
            case 'Metamask':
                if (
                    (await metamaskProvider.isAvailable()) &&
                    (await metamaskProvider.isLogged())
                ) {
                    const web3 = metamaskProvider.getProvider()
                    this.setState(
                        {
                            isLogged: true,
                            web3
                        },
                        () => {
                            this.loadNevermined()
                        }
                    )
                } else {
                    this.loadDefaultWeb3()
                }
                break
            case 'BurnerWallet':
                this.loginBurnerWallet()
                break
            default:
                this.loginBurnerWallet()
                break
        }
    }

    private fetchAccounts = async () => {
        const { sdk, isLogged } = this.state

        if (isLogged) {
            let accounts

            // Modern dapp browsers
            if (window.ethereum && !isLogged) {
                // simply set to empty, and have user click a button somewhere
                // to initiate account unlocking
                accounts = []

                // alternatively, automatically prompt for account unlocking
                // await this.unlockAccounts()
            }

            accounts = await sdk.accounts.list()

            if (accounts.length) {
                const account = await accounts[0].getId()

                if (account !== this.state.account) {
                    if(!localStorage.getItem('marketplaceApiToken'))
                    this.marketplaceLogin(sdk, accounts[0])

                    this.setState({
                        account,
                        isLogged: true,
                        requestFromFaucet: async () => { }
                    })

                    await this.fetchBalance(accounts[0])
                }
            } else {
                !isLogged && this.setState({ isLogged: false, account: '' })
            }
        }
    }

    private fetchBalance = async (account: Account) => {
        try {
            const balance = await account.getBalance()
            const { eth, nevermined } = balance
            if (eth !== this.state.balance.eth || nevermined !== this.state.balance.nevermined) {
                this.setState({ balance: { eth, nevermined } })
            }
        } catch (error) {
            console.log(error)
        }
    }

    private fetchNetwork = async () => {
        const { sdk } = this.state
        let network = 'Unknown'
        if (sdk.keeper) {
            network = await sdk.keeper.getNetworkName()
        }
        network !== this.state.network && this.setState({ network })
    }

    private fetchUserProfile = async (address: string): Promise<void> => {
        const { sdk } = this.state

        try {
            const userProfile = await sdk.profiles.findOneByAddress(address)
            this.setState({ userProfile })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    private fetchAllUserBundlers = async (account: string) => {

        if (account) {
            const bundles = await getAllUserBundlers(account)
            this.setState({ userBundles: bundles })
        }
    }

    public addToBasket(dids: string[]) {
        const basket = this.state.basket
        this.setState({ basket: basket.concat(...dids.filter(did => !basket.includes(did))) })
    }

    public removeFromBasket(dids: string[]): string[] {
        const didsSet = new Set(dids)
        this.setState(prevState => ({
            basket: prevState.basket.filter(did => !didsSet.has(did))
        }))
        return this.state.basket
    }

    public setAssets(assets: DDO[]) {
        this.setState({ assets })
    }

    public setSearchInputText(searchInputText: string) {
        this.setState({ searchInputText })
    }

    public setFromDate(fromDate: string) {
        this.setState({ fromDate })
    }

    public setToDate(toDate: string) {
        this.setState({ toDate })
    }

    public setSelectedCategories(selectedCategories: string[]) {
        this.setState({ selectedCategories })
    }

    public setSelectedNetworks(selectedNetworks: string[]) {
        this.setState({ selectedNetworks })
    }
    public setSelectedPriceRange(selectedPrice: number) {
        this.setState({ selectedPrice })
    }

    public setBookmarks(bookmarks: Bookmark[]) {
        this.setState({ bookmarks: [...bookmarks]})
    }

    public render() {
        return (
            <User.Provider value={this.state}>
                <MarketProvider nevermined={this.state.sdk}>
                    {this.props.children}
                </MarketProvider>
            </User.Provider>
        )
    }
}
