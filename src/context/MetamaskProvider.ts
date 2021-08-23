import Web3 from 'web3'

export class MetamaskProvider {
    private web3: Web3

    public constructor() {
        // Default
        this.web3 = null as any
        // Modern dapp browsers
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum)
        }
        // Legacy dapp browsers
        else if (window.web3) {
            this.web3 = new Web3(window.web3.currentProvider)
        }
    }

    public async isAvailable(): Promise<boolean> {
        return this.web3 !== null
    }

    public async isLogged(): Promise<boolean> {
        if (this.web3 === null) return false
        if ((await this.web3.eth.getAccounts()).length > 0) {
            return true
        }
        return false
    }

    public async startLogin(): Promise<void> {
        try {
            await window.ethereum.enable()
            localStorage.setItem('logType', 'Metamask')
        } catch (error) {
            return;
        }
    }

    public async logout(): Promise<void> {
        localStorage.removeItem('logType')
        // reload page?
    }

    public getProvider(): any {
        return this.web3
    }
}
