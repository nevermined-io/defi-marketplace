import React, { Props } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './divider.module.scss'

interface DividerProps {
  type?: 's' | 'l' | 'm' | 'xl' | 'xxl'
  vertical?: boolean
  flex?: boolean
  line?: boolean
  className?: string
}

const b = BEM('divider', styles)
function UiDividerComponent(props: DividerProps & Props<any>) {
  const {type, vertical, flex, line} = props

  const modifiers: any = {
    [type as string]: true,
    vertical,
    flex,
    line,
  }

  return (
    <div className={extendClassName(props, b(modifiers))} />
  )
}

export const UiDivider = React.memo(UiDividerComponent)
