import { MetamaskProvider } from './MetamaskProvider'

describe('MetamaskProvider', () => {
    it('MetamaskProvider can be created', async () => {
        const metamaskProvider = new MetamaskProvider()
        await metamaskProvider.startLogin()
        const web3 = metamaskProvider.getProvider()

        expect(web3)
    })
})
