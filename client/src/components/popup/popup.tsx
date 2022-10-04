import React from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton, UiDivider } from '@nevermined-io/styles'
import styles from './popup.module.scss'
import CrossIcon from '../../../public/assets/blue-cross.svg'

interface PopupProps {
  message: string | React.ReactElement | undefined
  additionalMessage?: string | string[]
  showCloseButton?: boolean
  image?: React.ReactElement
  popUpHeight?: string
  popupRef: React.MutableRefObject<UiPopupHandlers | undefined>
  resultOk?: boolean
  buttons?: React.ReactNode
}

const b = BEM('popup', styles)

export const PopupContent: React.FC<PopupProps> = ({
  message,
  image,
  popupRef,
  popUpHeight = '400px',
  additionalMessage = '',
  showCloseButton = false,
  resultOk,
  buttons
}) => (
  <div className={b('container')} style={{ height: popUpHeight }}>
    <div className={b('logo')}>{image}</div>
    <div className={b('content')}>
      <div className={b('message-container')}>
        <UiText block type="h3" className={b('text')} variants={resultOk ? ['success'] : ['error']}>
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
      {showCloseButton && (
        <UiButton
          type="icon"
          className={b('close-button')}
          onClick={() => popupRef.current?.close()}
        >
          <UiText className={b('close-text')}>Close</UiText>
          <CrossIcon className={b('close-icon')} />
        </UiButton>
      )}
      {!!buttons && <div className={b('buttons')}>{buttons}</div>}
    </div>
  </div>
)

export const Popup: React.FC<React.PropsWithChildren<PopupProps>> = (props) => {
  const content = props.children && <PopupContent {...props} />
  return <UiPopup ref={props.popupRef}>{content}</UiPopup>
}
