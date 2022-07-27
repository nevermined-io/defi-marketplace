import { graphUrl } from 'src/config'
import { Nevermined } from '@nevermined-io/nevermined-sdk-js'
import {
  RegisterEvent,
  MetaMask,
  getAssetRegisterEvent,
  getUserRegisterEvents
} from '@nevermined-io/catalog-providers'

interface FullfilledOrders {
  documentId: string
}

export const loadFullfilledEvents = async (
  sdk: Nevermined,
  account: string
): Promise<FullfilledOrders[]> => {
  const fullfilled = await sdk.keeper.conditions.accessCondition.events.getPastEvents({
    methodName: 'getFulfilleds',
    filterSubgraph: {
      where: {
        _grantee: account
      }
    },
    result: {
      _documentId: true
    }
  })

  return fullfilled.map((doc) => {
    return { documentId: doc._documentId }
  })
}

export interface RegisteredAsset {
  did: string
  owner: string
  registeredAt: Date
}

export const loadPublishedEvent = async (
  asset: string,
  provider: MetaMask.MetamaskProvider
): Promise<RegisteredAsset | undefined> => {
  const registered = await getAssetRegisterEvent(asset, graphUrl)
  if (registered.length) {
    const tx = await provider.getBlock(registered[0]._blockNumberUpdated.toNumber())
    return {
      did: registered[0]._did,
      owner: registered[0]._owner,
      registeredAt: new Date(Number(tx.timestamp) * 1000)
    }
  }
}

export const loadUserPublished = async (
  sdk: Nevermined,
  owner: string
): Promise<RegisterEvent[]> => {
  const registered = await getUserRegisterEvents(sdk, owner)
  return registered
}
