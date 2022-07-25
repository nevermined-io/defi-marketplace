import { Account, Nevermined, MetaData, File } from '@nevermined-io/nevermined-sdk-js'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { BigNumber } from 'bignumber.js';
import { tier1NftContractAddress } from 'src/config';


export const registerSubscription = async (sdk: Nevermined, owner: Account) => {
  const file: File = {
    url: "abc",
    contentType: "text/plain"
  }
  const metadata: MetaData = {
    main: {
      name: "Tier1",
      author: "Nevermined",
      dateCreated: (new Date()).toISOString(),
      license: "CC0: Public Domain",
      price: "0",
      type: "dataset",
      files: [file]
    }
  }

  const assetRewards = new AssetRewards(
    new Map([
      [owner.getId(), new BigNumber(1)],
    ])
  )
  debugger
  const tierDDO = await sdk.nfts.create721(
    metadata,
    owner,
    assetRewards,
    '0x4fA984F91d393fb7ec9d2727Bcd88d0A7Ad3A7F4'
    //nftparameters
  )

  console.log(tierDDO)

}


export const purchaseSubscription = async (sdk: Nevermined, owner: Account, subscriber: Account) => {

  const agreementId = await sdk.nfts.order(tier1NftContractAddress, 1, owner)

  return sdk.nfts.transferForDelegate(
    agreementId,
    owner.getId(),
    subscriber.getId(),
    1
  )
}
