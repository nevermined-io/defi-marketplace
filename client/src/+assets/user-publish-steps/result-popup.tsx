import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'
import NeverminedIcon from '../../../public/assets/nevermined-color.svg'

interface ResultPopupProps {
  message: string
  resultOk: boolean
  additionalMessage?: string | string[]
  popupRef: React.MutableRefObject<UiPopupHandlers | undefined>
}

const b = BEM('popup', styles)

export const ResultPopup: React.FC<ResultPopupProps> = ({
  message,
  additionalMessage,
  resultOk = true,
  popupRef
}: ResultPopupProps) => {
  return (
    <>
      <UiPopup ref={popupRef}>
        <div className={b('confirm')} style={{ height: 'auto', width: 'auto' }}>
          <div className={b('logo')}>
            <NeverminedIcon />
          </div>
          <div className={b('content')}>
            <div className={b('message-container')}>
              <UiText
                block
                type="h3"
                variants={resultOk ? ['success'] : ['error']}
                className={b('text')}
              >
                {message}
              </UiText>
              {additionalMessage && (
                <>
                  <UiDivider type="l" />
                  <UiText block type="h4" className={b('text', ['additional'])}>
                    {additionalMessage}
                  </UiText>
                </>
              )}
            </div>
            <UiButton onClick={() => popupRef.current?.close()}>Close</UiButton>
          </div>
        </div>
      </UiPopup>
    </>
  )
}
