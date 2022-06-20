import React, { Props, HTMLAttributes, useContext, createRef } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { BEM, modList, extendClassName, UiPopup, UiPopupHandlers } from '@nevermined-io/styles'
import styles from './create-bundle.module.scss'
import { XuiCreateBundlePopup } from './popup/create-bundle-popup'

interface BuyAssetProps {
  assets: DDO[],
  price: number
}

const b = BEM('create-bundle', styles)

export function XuiCreateBundle(props: BuyAssetProps & HTMLAttributes<any> & Props<any>) {
  const {children, assets, price} = props
  const popupRef = createRef<UiPopupHandlers>()

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiCreateBundlePopup assets={assets} price={price} close={() => popupRef.current?.close()}/>
      </UiPopup>

      <div className={extendClassName(props, b())} onClick={openPopup}>
        {children}
      </div>
    </>
  )
}
