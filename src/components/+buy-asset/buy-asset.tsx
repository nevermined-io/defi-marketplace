import React, { Props, HTMLAttributes, useContext, createRef } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { BEM, modList, extendClassName, UiButton, UiPopup, UiPopupHandlers } from 'ui'
import { useUserContext } from 'src/context'
import styles from './buy-asset.module.scss'
import { XuiBuyAssetPopup } from './popup/buy-asset-popup'


interface BuyAssetProps {
  asset: DDO
  content: (consumable: boolean) => React.ReactNode
  children?: never
}

const b = BEM('buy-asset', styles)

export function XuiBuyAsset(props: BuyAssetProps & HTMLAttributes<any> & Props<any>) {
  const {children, asset} = props
  const popupRef = createRef<UiPopupHandlers>()
  const {consumableAssets} = useUserContext()

  const consumable = consumableAssets.includes(props.asset.id)

  const click = (event: any) => {
    if (consumable) {
    } else {
      popupRef.current?.open()
      event.preventDefault()
    }
  }

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiBuyAssetPopup asset={asset} close={() => popupRef.current?.close()}/>
      </UiPopup>

      <div className={extendClassName(props, b())} onClick={click}>
        {props.content(consumable)}
      </div>
    </>
  )
}
