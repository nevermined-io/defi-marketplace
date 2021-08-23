import React, { Props } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './text.module.scss'

interface TextProps<W extends keyof JSX.IntrinsicElements> {
  wrapper?: W
  block?: boolean
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h4-caps' | 'caps' | 'small' | 'small-caps' | 'link' | 'link-bold'
  variants?: (undefined)[]
}

const b = BEM('text', styles)

export function UiText<W extends keyof JSX.IntrinsicElements = 'div'>(props: TextProps<W> & Omit<JSX.IntrinsicElements[W], 'style'> & Props<any>) {
  const {wrapper, type, block, variants = [], children} = props
  const cleanProps = {...props, style: undefined, type: undefined, block: undefined, variants: undefined, wrapper: undefined}

  const Wrapper: any = wrapper || (block ? 'div' : 'span')
  const modifiers = [type, ...variants]

  return (
    <Wrapper {...cleanProps} className={extendClassName(props, b(modifiers))}>
      {children}
    </Wrapper>
  )
}
