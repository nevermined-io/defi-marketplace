import { graphUrl } from 'src/config'
import { Nevermined, subgraphs } from '@nevermined-io/nevermined-sdk-js'
import { MetaMask } from '@nevermined-io/catalog-providers'

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
  const registered = await subgraphs.DIDRegistry.getDIDAttributeRegistereds(
    `${graphUrl}/DIDRegistry`,
    {
      where: {
        _did: asset
      }
    },
    {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true
    }
  )

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
): Promise<any | undefined> => {
  const registered = await sdk.keeper.didRegistry.events.getPastEvents({
    methodName: 'getDIDAttributeRegistereds',
    filterSubgraph: {
      where: {
        _owner: owner
      }
    },
    result: {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true
    }
  })

  return registered
}

export const getUserSubscription = async (
  sdk: Nevermined,
  userAddress: string,
  subscriptionDid: string
): Promise<any | undefined> => {

  const subscriptions = await sdk.keeper.conditions.transferNft721Condition.events.getPastEvents({
    methodName: 'getFulfilleds',
    eventName: 'Fulfilled',
    filterSubgraph: {
      where: {
          _did: subscriptionDid,
          _receiver: userAddress
      }
    },
    result: {
        _agreementId: true,
        _did: true,
        _receiver: true
    }
  })

  return subscriptions
}
