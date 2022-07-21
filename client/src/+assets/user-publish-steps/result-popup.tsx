import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'

interface ResultPopupProps {
  message: string
  resultOk: boolean
  additionalMessage?: string
  popupRef :React.RefObject<UiPopupHandlers>
  confirm: () => void
  cancel: () => void
}

const b = BEM('popup', styles)

export const ResultPopup: React.FC<ResultPopupProps> = ({message, additionalMessage, resultOk = true, popupRef}: ResultPopupProps) => {

  return (
    <>
      <UiPopup ref={popupRef}>

      <div className={b('confirm')} style={{ height: 'auto', width: 'auto'}}>
         <UiDivider/>
          <img src="/assets/nevermined-color.svg" width="73px" />
          <UiDivider/>
          <UiDivider/>
          <UiText block type="h3" variants={resultOk?['success']:['error']} className={b('text')}>{message}</UiText>
          <UiDivider/>
          <UiDivider/>
          {additionalMessage && 
            <div>
            <UiText block type="h4" className={b('text')}>{additionalMessage}</UiText>
            <UiDivider/>
            </div>
          }
          <div >
            <UiButton onClick={(e:any) => popupRef.current?.close()}>Close</UiButton>
          </div>
          <UiDivider type="l" />
        </div>  
      </UiPopup>

    </>
  )

}