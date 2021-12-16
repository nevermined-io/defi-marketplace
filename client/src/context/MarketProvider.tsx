import React, { PureComponent } from 'react'
import { Logger, Nevermined } from '@nevermined-io/nevermined-sdk-js'
import { Market, User } from '.'

const categories: any[] = []

interface MarketProviderProps {
    nevermined: Nevermined
}

export interface MarketProviderState {
    totalAssets: number
    categories: string[]
    network: string
    networkMatch: boolean
}

export default class MarketProvider extends PureComponent<
    MarketProviderProps,
    MarketProviderState
> {
    public static contextType = User

    public state = {
        totalAssets: 0,
        categories,
        network: 'Rinkeby',
        networkMatch: false
    }

    public async componentDidMount() {
        await this.checkCorrectUserNetwork()
    }

    public async componentDidUpdate(prevProps: any) {
        // Using nevermined prop instead of getting it from context to be able to compare.
        // Cause there is no `prevContext`.
        if (prevProps.nevermined !== this.props.nevermined) {
            await this.getTotalAssets()
            await this.getMarketNetwork()
            await this.checkCorrectUserNetwork()
        }
    }

    private getTotalAssets = async () => {
        const searchQuery = {
            offset: 1,
            page: 1,
            query: {
                "categories": categories
            },
            sort: {
                value: 1
            }
        }

        try {
            const { nevermined } = this.props
            const search = await nevermined.assets.query(searchQuery)
            this.setState({ totalAssets: search.totalResults })
        } catch (error) {
            Logger.error('Error', error.message)
        }
    }

    private getMarketNetwork = async () => {
        try {
            const { nevermined } = this.props
            // Set desired network to whatever Gateway is running in
            const gateway = await nevermined.gateway.getVersionInfo()
            const network =
                gateway.network.charAt(0).toUpperCase() + gateway.network.slice(1)
            this.setState({ network })
        } catch (error) {
            Logger.error('Error', error.message)
        }
    }

    private async checkCorrectUserNetwork() {
        if (this.context.network === this.state.network) {
            this.setState({ networkMatch: true })
        } else {
            this.setState({ networkMatch: false })
        }
    }

    public render() {
        return (
            <Market.Provider value={this.state}>
                {this.props.children}
            </Market.Provider>
        )
    }
}
