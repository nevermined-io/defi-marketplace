import React, { Props, HTMLAttributes, useContext, createRef } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { BEM, modList, extendClassName, UiButton, UiPopup, UiPopupHandlers } from 'ui'
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
