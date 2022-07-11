import React, { Props, HTMLAttributes, createRef } from 'react'

import { BEM, extendClassName, UiPopup, UiPopupHandlers } from '@nevermined-io/styles'
import styles from './buy-asset.module.scss'
import { XuiBuyAssetPopup } from './popup/buy-asset-popup'

interface BuyAssetProps {
  asset: string
}

const b = BEM('buy-asset', styles)

export function XuiBuyAsset(props: BuyAssetProps & HTMLAttributes<any> & Props<any>) {
  const {children, asset} = props
  const popupRef = createRef<UiPopupHandlers>()

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiBuyAssetPopup asset={asset} close={() => popupRef.current?.close()}/>
      </UiPopup>

      <div className={extendClassName(props, b())} onClick={openPopup}>
        {children}
      </div>
    </>
  )
}
