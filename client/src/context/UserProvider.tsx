import React, { PureComponent, } from 'react'
import Web3 from 'web3'
import { Nevermined, Account, DDO } from '@nevermined-io/nevermined-sdk-js'
import { User } from '.'
import MarketProvider from './MarketProvider'
import { MetamaskProvider } from './MetamaskProvider'
import { BurnerWalletProvider } from './BurnerWalletProvider'

import {
    metadataUri,
    gatewayUri,
    gatewayAddress,
    faucetUri,
    nodeUri,
    secretStoreUri,
    verbose
} from '../config'

export async function provideNevermined(web3Provider: Web3): Promise<any> {
    const config = {
        web3Provider,
        nodeUri,
        metadataUri,
        gatewayUri,
        faucetUri,
        gatewayAddress,
        secretStoreUri,
        verbose
    }
    const sdk: any = await Nevermined.getInstance(config)
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
    balance: {
        eth: number
        nevermined: number
    }
    network: string
    web3: Web3
    sdk: Nevermined
    requestFromFaucet(account: string): Promise<any>
    loginMetamask(): Promise<any>
    loginBurnerWallet(): Promise<any>
    logoutBurnerWallet(): Promise<any>
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
}

export default class UserProvider extends PureComponent<{}, UserProviderState> {
    public componentDidUpdate() {
        window?.ethereum?.on('accountsChanged', (accounts) => {
            this.fetchAccounts()
        })

        window?.ethereum?.on('chainChanged', async (accounts) => {
            await this.fetchNetwork()
        })

    }

    private loginMetamask = async () => {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
        }
        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.startLogin()
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
        balance: {
            eth: 0,
            nevermined: 0
        },
        network: '',
        web3: DEFAULT_WEB3,
        account: '',
        sdk: {} as any,
        requestFromFaucet: (): Promise<FaucetResponse> => requestFromFaucet(''),
        loginMetamask: (): Promise<any> => this.loginMetamask(),
        loginBurnerWallet: (): Promise<any> => this.loginBurnerWallet(),
        logoutBurnerWallet: (): Promise<any> => this.logoutBurnerWallet(),
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
        setSelectedPriceRange: (selectedPrice: number) => this.setSelectedPriceRange(selectedPrice)
    }

    private accountsInterval: any = null

    private networkInterval: any = null

    public async componentDidMount() {
        await this.bootstrap()
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

    private loadNevermined = async (): Promise<void> => {
        const { sdk } = await provideNevermined(this.state.web3)
        this.setState({ sdk, isLoading: false }, () => {
            this.initNetworkPoll()
            this.initAccountsPoll()
            this.fetchNetwork()
            this.fetchAccounts()
            this.fetchTokenSymbol()
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

            if (accounts.length > 0) {
                const account = await accounts[0].getId()

                if (account !== this.state.account) {
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
