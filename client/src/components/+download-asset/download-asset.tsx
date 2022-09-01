import React, { Props, HTMLAttributes } from 'react'

import { UiPopup, UiPopupHandlers } from '@nevermined-io/styles'
import { XuiDownloadAssetPopup } from './popup/download-asset-popup'

interface DownloadAssetProps {
  assetDid: string
  popupRef:  React.MutableRefObject<UiPopupHandlers | undefined>
}


export function XuiDownloadAsset(props: DownloadAssetProps & HTMLAttributes<any> & Props<any>) {
  const { assetDid, popupRef } = props

  return (
    <>
      <UiPopup ref={popupRef}>
        <XuiDownloadAssetPopup assetDid={assetDid} close={() => popupRef.current?.close()} />
      </UiPopup>
    </>
  )
}
