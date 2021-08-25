import React, { Props, HTMLProps, ButtonHTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './button.module.scss'

interface ButtonProps {
  secondary?: boolean
  error?: boolean
}

const b = BEM('button', styles)
export function UiButton(props: ButtonProps & ButtonHTMLAttributes<any> & Props<any>) {
  const {children, secondary, error} = props
  const cleanProps = {...props, secondary: undefined, error: undefined}

  return (
    <button type="button"  {...cleanProps} className={extendClassName(props, b({secondary, error}))}>
      {children}
    </button>
  )
}
