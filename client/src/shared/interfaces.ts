import { Bytes } from '@ethersproject/bytes'
import {
  ProviderMessage,
  ProviderRpcError,
  ProviderConnectInfo,
  RequestArguments
} from 'hardhat/types'

export interface Methods<T> {
  balanceOf: (address: string, tokenId: number) => this
  setApprovalForAll: (operator: string, approved: boolean) => this
  safeTransferFrom: (from: string, to: string, id: number, amount: number, data: Bytes) => this
  isApprovedForAll: (account: string, address: string) => this
  hasRole: (role: string, address: string) => this
  calcReward: (address: string) => this
  faucetNFT: () => this
  mintRZR: () => this
  call: () => T
  send: (from: string) => T
}

export interface DispatchData<T> {
  type: string
  payload: T
  error: Error
}

export interface EthereumEvent {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  accountsChanged: Array<string>
  chainChanged: string
  message: ProviderMessage
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean
  chainId: string
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion: string
  selectedAddress: any

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
  enable(): Promise<any>
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void
  sendAsync: (request: RequestArguments) => Promise<unknown>
}
