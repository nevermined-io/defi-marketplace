import React from 'react'
import { UiText, UiPopup, UiPopupHandlers, UiButton, BEM } from 'ui'
import styles from './notification-popup.module.scss'


interface NotificationPopupProps {
  closePopup : (event:any)=> void,
  message: string,
  popupRef :React.RefObject<UiPopupHandlers>
}

const b = BEM('notification-popup', styles)

export function NotificationPopup({closePopup, message, popupRef}: NotificationPopupProps) {


  return (
    <>
      <UiPopup ref={popupRef}>
        <div className={b('notification-popup')}>
          <div className={b('popup-text')}>
            <UiText style={{ color: '#2E405A', margin: '72px 0 25px' }} type="h3">{message}</UiText>
          </div>
          <div className={b('popup-buttons')}>
            <UiButton cover style={{ padding: '0', width: '170px' }} onClick={closePopup}>Got it</UiButton>
          </div>
        </div>
      </UiPopup>
    </>
  )
}