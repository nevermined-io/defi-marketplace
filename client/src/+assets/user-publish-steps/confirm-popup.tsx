import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiIcon, CircleSpinner, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'

interface ConfirmPopupProps {
  message: string
  popupRef :React.RefObject<UiPopupHandlers>
  confirm: () => void
  cancel: () => void
}

const b = BEM('popup', styles)

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({message, popupRef, confirm, cancel}: ConfirmPopupProps) => {

  return (
    <>
      <UiPopup ref={popupRef}>

      <div className={b('confirm')} style={{ height: '480px' }}>
         <UiDivider/>
          <img src="/assets/nevermined-color.svg" width="73px" />
          <UiDivider/>
          <UiDivider/>
          <UiText block type="h3" className={b('text')}>{message}</UiText>
          <UiDivider/>
          <UiDivider/>
          <UiDivider/>
          <div >
            <UiButton onClick={confirm}>Confirm</UiButton>
            <UiButton onClick={cancel}>Cancel</UiButton>
          </div>
          <UiDivider type="l" />
        </div>

      </UiPopup>

    </>
  )

}
