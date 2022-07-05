import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiIcon, CircleSpinner, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'

interface ProgressPopupProps {
  message: string,
  popupRef :React.RefObject<UiPopupHandlers>
}

const b = BEM('popup', styles)

export const ProgressPopup: React.FC<ProgressPopupProps> = ({message, popupRef}: ProgressPopupProps) => {

  return (
    <>
      <UiPopup ref={popupRef}>

      <div className={b('confirm')} style={{ height: '480px' }}>
          <UiDivider type="l"/>
          <img src="/assets/logos/filecoin_grey.svg" width="73px" />
          <UiDivider type="l"/>
          <UiText block type="h3" className={b('text')}>{message}</UiText>
          <UiDivider type="l"/>
          <CircleSpinner width="150" height="150" circleSpimmerSrc='/assets/circle-loadspinner.svg'/>
          <UiDivider type="l" />
        </div>

      </UiPopup>

    </>
  )

}
