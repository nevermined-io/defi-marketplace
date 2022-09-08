import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton } from '@nevermined-io/styles'
import styles from './popup.module.scss'

interface ConfirmPopupProps {
  message: string
  popupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  confirm: () => void
  cancel: () => void
}

const b = BEM('popup', styles)

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  message,
  popupRef,
  confirm,
  cancel
}: ConfirmPopupProps) => {
  return (
    <>
      <UiPopup ref={popupRef}>
        <div className={b('confirm')}>
          <div className={b('logo')}>
            <img src="/assets/nevermined-color.svg" />
          </div>
          <div className={b('confirm-text')}>
            <UiText block type="h3" className={b('text')}>
              {message}
            </UiText>
          </div>
          <div>
            <div className={b('buttons')}>
              <UiButton onClick={confirm}>Confirm</UiButton>
              <UiButton onClick={cancel}>Cancel</UiButton>
            </div>
          </div>
        </div>
      </UiPopup>
    </>
  )
}
