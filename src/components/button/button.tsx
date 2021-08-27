import React, { Props, HTMLProps, ButtonHTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './button.module.scss'

interface ButtonProps {
  type: 'secondary' | 'alt' | 'error'
  cover?: boolean
  square?: boolean
}

const b = BEM('button', styles)
export function UiButton(props: ButtonProps & ButtonHTMLAttributes<any> & Props<any>) {
  const {children, type = false, cover = false, square = false} = props
  const cleanProps = {...props, type: undefined, cover: undefined, square: undefined}

  return (
    <button type="button"  {...cleanProps} className={extendClassName(props, b({[type as any]: true, cover, square}))}>
      {children}
    </button>
  )
}
