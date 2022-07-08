import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiIcon, CircleSpinner, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'

interface ProgressPopupProps {
  message: string,
  additionalMessage: string
  showCloseButton: boolean
  image: string,
  popUpHeight: string,
  popupRef :React.RefObject<UiPopupHandlers>
}

const b = BEM('popup', styles)

export const ProgressPopup: React.FC<ProgressPopupProps> = ({message, image, popupRef, popUpHeight='480px', additionalMessage='', showCloseButton= false}: ProgressPopupProps) => {

  return (
    <>
      <UiPopup ref={popupRef}>

      <div className={b('confirm')} style={{ height: popUpHeight }}>
          <UiDivider type="l"/>
          <img src={image} width="73px" />
          <UiDivider type="l"/>
          <UiText block type="h3" className={b('text')}>{message}</UiText>
          <UiDivider type="l"/>
          <CircleSpinner width="150" height="150" circleSpimmerSrc='/assets/circle-loadspinner.svg'/>
          <UiDivider type="l" />
          <UiText block type="h4" className={b('text')}>{additionalMessage}</UiText>
          <UiDivider type="l" />
          { showCloseButton && 
            <div >
              <UiButton onClick={(e:any) => popupRef.current?.close()}>Close</UiButton>
            </div>
          }
        </div>

      </UiPopup>

    </>
  )

}
