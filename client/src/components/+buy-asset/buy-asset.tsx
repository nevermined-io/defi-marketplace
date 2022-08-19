import React, { Props, HTMLAttributes } from 'react'

import { BEM, UiPopup, UiPopupHandlers } from '@nevermined-io/styles'
import { XuiBuyAssetPopup } from './popup/buy-asset-popup'

interface BuyAssetProps {
  assetDid: string
  popupRef:  React.MutableRefObject<UiPopupHandlers | undefined>
}


export function XuiBuyAsset(props: BuyAssetProps & HTMLAttributes<any> & Props<any>) {
  const { assetDid, popupRef } = props

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiBuyAssetPopup assetDid={assetDid} close={() => popupRef.current?.close()} />
      </UiPopup>
    </>
  )
}
