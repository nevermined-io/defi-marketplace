import React, { Props, HTMLAttributes, createRef } from 'react'

import { BEM, extendClassName, UiPopup, UiPopupHandlers } from '@nevermined-io/styles'
import styles from './buy-asset.module.scss'
import { XuiBuyAssetPopup } from './popup/buy-asset-popup'

interface BuyAssetProps {
  assetDid: string
  popupRef:  React.MutableRefObject<UiPopupHandlers | undefined>
}

const b = BEM('buy-asset', styles)

export function XuiBuyAsset(props: BuyAssetProps & HTMLAttributes<any> & Props<any>) {
  const { children, assetDid, popupRef } = props

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiBuyAssetPopup assetDid={assetDid} close={() => popupRef.current?.close()} />
      </UiPopup>
    </>
  )
}
