import { graphUrl } from 'src/config'
import { subgraphs } from '@nevermined-io/nevermined-sdk-js'
import Web3 from 'web3';

interface FullfilledOrders {
  documentId: string;
}

export const loadFullfilledEvents = async (account: string): Promise<FullfilledOrders[]> => {
  const fullfilled = await subgraphs.AccessCondition.getFulfilleds(
    `${graphUrl}/AccessCondition`,
    {
      where: {
        _grantee: account,
      },
    },
    {
      _documentId: true
    }
  )

  return fullfilled.map(doc => { return { documentId: doc._documentId } })

}


export interface RegisteredAsset {
  did: string,
  owner: string,
  registeredAt: Date
}

export const loadPublishedEvent = async (asset: string, web3: Web3): Promise<RegisteredAsset | undefined> => {

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
    const tx = await web3.eth.getBlock(registered[0]._blockNumberUpdated.toNumber())
    return {
      did: registered[0]._did,
      owner: registered[0]._owner,
      registeredAt: new Date(Number(tx.timestamp) * 1000)
    }
  }
}
