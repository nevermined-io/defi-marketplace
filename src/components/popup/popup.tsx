import React, { useEffect, useState, Props, HTMLProps, HTMLAttributes, forwardRef, useImperativeHandle } from 'react'
import ReactDOM from 'react-dom'
import { BEM, modList, extendClassName } from 'ui'
import styles from './popup.module.scss'

const popupId = 'POPUP_CONTAINER'
export interface UiPopupHandlers {
  open: () => void
  close: () => void
  toggle: () => void
}

interface PopupProps {
}

const b = BEM('popup', styles)
export const UiPopup = forwardRef(function(props: PopupProps & HTMLAttributes<any> & Props<any>, ref) {
  const {children} = props
  const cleanProps = {...props, type: undefined, align: undefined}
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!open),
  }));

  const close = () => {
    setOpen(false)
  }

  useEffect(() => {
    return close
  }, [])

  if(typeof document === "undefined") {
    return null
  }

  let container = document.getElementById(popupId)!
  if (!container) {
    container = document.createElement('div')
    container.id = popupId
    document.body.appendChild(container)
  }

  if (open) {
    const PopupContext = React.createContext({
      component: null,
      props,
    })

    return ReactDOM.createPortal(
      <div {...cleanProps} className={extendClassName(props, b())}>
        <div className={b('overlay')} onClick={close} />
        <div className={b('content-wrapper')}>
          <div className={b('content')}>
            {children}
          </div>
        </div>
      </div>
      , container,
    )
  } else {
    return null
  }
})
