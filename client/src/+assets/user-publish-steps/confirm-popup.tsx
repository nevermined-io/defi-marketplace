import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton } from '@nevermined-io/styles'
import styles from './popup.module.scss'
import NeverminedIcon from '../../../public/assets/nevermined-color.svg'

interface ConfirmPopupProps {
  message: string | React.ReactElement | undefined
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
            <NeverminedIcon />
          </div>
          <div className={b('content')}>
            <div className={b('message-container')}>
              <UiText block type="h3" className={b('text')}>
                {message}
              </UiText>
            </div>
            <div className={b('buttons')}>
              <UiButton type="secondary" onClick={cancel}>Cancel</UiButton>
              <UiButton onClick={confirm}>Confirm</UiButton>
            </div>
          </div>
        </div>
      </UiPopup>
    </>
  )
}
