import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiIcon, CircleSpinner, UiDivider } from '@nevermined-io/styles'
import styles from './progress-popup.module.scss'

interface ProgressPopupProps {
  message: string,
  popupRef :React.RefObject<UiPopupHandlers>
}

const b = BEM('progress-popup', styles)

export const ProgressPopup: React.FC<ProgressPopupProps> = ({message, popupRef}: ProgressPopupProps) => {

  return (
    <>
      <UiPopup ref={popupRef}>

      <div className={b('confirm')} style={{ height: '480px' }}>
          <UiIcon className={b('icon', ['success'])} icon="circleOk" size="xxl" />
          <UiText block type="h3" className={b('text')}>{message}</UiText>
          <CircleSpinner width="150" height="150" circleSpimmerSrc='/assets/circle-loadspinner.svg'/>
          <UiDivider type="l" />
        </div>

      </UiPopup>

    </>
  )

}
