import React from 'react'
import { render } from '@testing-library/react'
import MarketProvider from './MarketProvider'
import { User, Market } from '../context'
import { userMockConnected } from '../../__mocks__/user-mock'

describe('MarketProvider', () => {
    it('renders without crashing', () => {
        const { getByTestId } = render(
            <User.Provider value={userMockConnected}>
                <MarketProvider nevermined={userMockConnected.sdk as any}>
                    <Market.Consumer>
                        {market => (
                            <div data-testid="hello">{market.network}</div>
                        )}
                    </Market.Consumer>
                </MarketProvider>
            </User.Provider>
        )
        expect(getByTestId('hello')).toBeInTheDocument()
    })
})
