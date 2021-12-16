import { BurnerWalletProvider } from './BurnerWalletProvider'

describe('BurnerWalletProvider', () => {
    it('Burner wallet can be created', async () => {
        const burnerwalletProvider = new BurnerWalletProvider()
        await burnerwalletProvider.startLogin()
        const web3 = burnerwalletProvider.getProvider()

        expect(web3)
    })
})
