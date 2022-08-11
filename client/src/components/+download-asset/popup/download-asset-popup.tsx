import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton } from '@nevermined-io/styles'
import styles from './download-asset-popup.module.scss'

interface DownloadPopupProps {
  closePopup: (event: any) => void
  popupRef: React.RefObject<UiPopupHandlers>
}

const b = BEM('download-popup', styles)

export function DownloadPopup({ closePopup, popupRef }: DownloadPopupProps) {
  return (
    <>
      <UiPopup ref={popupRef}>
        <div className={b('basket-popup')}>
          <img src="/assets/download_icon.svg" width="73px" />

          <UiText style={{ color: '#2E405A', margin: '72px 0 25px' }} type="h3">
            Download In Progress
          </UiText>
          <div className={b('popup-text')}>
            Please, Sign the transaction on MetaMask to download the Asset.
          </div>
          <div className={b('popup-buttons')}>
            <UiButton cover style={{ padding: '0', width: '170px' }} onClick={closePopup}>
              Back To Profile
            </UiButton>
          </div>
        </div>
      </UiPopup>
    </>
  )
}
