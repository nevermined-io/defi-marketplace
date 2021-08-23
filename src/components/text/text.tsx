import React, { Props } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './text.module.scss'

interface TextProps<W extends keyof JSX.IntrinsicElements> {
  wrapper?: W
  block?: boolean
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h4-caps' | 'caps' | 'small' | 'small-caps' | 'link' | 'link-bold' | 'link-caps'
  clear?: ('font' | 'color' | 'line-height' | 'text-transform')[]
  variants?: ('highlight')[]
}

const b = BEM('text', styles)

export function UiText<W extends keyof JSX.IntrinsicElements = 'div'>(props: TextProps<W> & Omit<JSX.IntrinsicElements[W], 'style'> & Props<any>) {
  const {wrapper, type, block, variants = [], children, clear = []} = props
  const cleanProps = {...props, clear: undefined, type: undefined, block: undefined, variants: undefined, wrapper: undefined}

  const Wrapper: any = wrapper || (block ? 'div' : 'span')
  const modifiers: any[] = [type, ...variants]

  if (clear.length) {
    modifiers.push('clear', ...clear.map(_ => `clear-${_}`))
  }

  return (
    <Wrapper {...cleanProps} className={extendClassName(props, b(modifiers))}>
      {children}
    </Wrapper>
  )
}
