import React, { Props, HTMLProps, ButtonHTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './button.module.scss'

interface ButtonProps {
}

const b = BEM('button', styles)
export function UiButton(props: ButtonProps & ButtonHTMLAttributes<any> & Props<any>) {
  const {children} = props
  const cleanProps = {...props}

  return (
    <button type="button"  {...cleanProps} className={extendClassName(props, b())}>
      {children}
    </button>
  )
}
