import { graphUrl } from 'src/config'
import { Nevermined, subgraphs } from '@nevermined-io/nevermined-sdk-js'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { didZeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'

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

export const loadUserDownloads = async (
  sdk:Nevermined,
  userAddress: string
): Promise<any | undefined> => {

  const useds = sdk.keeper.didRegistry.events.getPastEvents({
    methodName: 'getUseds',
    filterSubgraph: {
      where: {
        _agentId: userAddress,
        _attributes: 'nft access'
      },
      orderBy: "_blockNumberUpdated" ,
      orderDirection: "desc"     
    },
    result: {
      id: true,
      _did: true,
      __typename: true,
      _attributes: true,
      _blockNumberUpdated: true,
      _agentId: true
    }

  })
  return useds
}

export const loadAssetProvenance = async (
  sdk:Nevermined,
  provider: MetaMask.MetamaskProvider,
  did: string
): Promise<any | undefined> => {

  let useds = sdk.keeper.didRegistry.events.getPastEvents({
    methodName: 'getUseds',
    filterSubgraph: {
      where: {
        _did: didZeroX(did)
      },
      orderBy: "_blockNumberUpdated" ,
      orderDirection: "desc"     
    },
    result: {
      id: true,
      _did: true,
      __typename: true,
      _attributes: true,
      _blockNumberUpdated: true,
      _agentId: true
    }

  });

  useds = Promise.all(
    (await useds).map( async(event) => {
    const block = await provider.getBlock(event._blockNumberUpdated.toNumber())
    return {...event, date: new Date(Number(block.timestamp) * 1000)}
  })
  )

  return useds
}


export const getUserSubscription = async (
  sdk: Nevermined,
  provider: MetaMask.MetamaskProvider,
  userAddress: string,
  subscriptionDid: string
): Promise<any | undefined> => {

  let subscriptions =  sdk.keeper.conditions.transferNft721Condition.events.getPastEvents({
    methodName: 'getFulfilleds',
    eventName: 'Fulfilled',
    filterSubgraph: {
      where: {
          _did: subscriptionDid,
          _receiver: userAddress
      }
    },
    result: {
        id: true,
        _agreementId: true,
        _did: true,
        _receiver: true
    }
  })

  subscriptions = Promise.all( 
    (await subscriptions).map( async (event) => {
      const [txHash] = event.id.split('-')
      const tx = await provider.getTransaction(txHash)
      const blockNumber = tx.blockNumber
      if (!blockNumber)
        return {...event, date: null}
      const block = await provider.getBlock(blockNumber)
      return {...event, date: new Date(Number(block.timestamp) * 1000)}
    })
  )

  return subscriptions
}