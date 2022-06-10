import React, { Props, ForwardedRef } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './text.module.scss'

interface TextProps<W extends keyof JSX.IntrinsicElements> {
  wrapper?: W
  block?: boolean
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h4-caps' | 'p' | 'caps' | 'small' | 'small-caps' | 'link' | 'link-bold' | 'link-caps'
  clear?: ('font' | 'color' | 'line-height' | 'text-transform')[]
  variants?: ('heading' | 'highlight' | 'detail' | 'secondary' | 'underline' | 'bold' | 'success' | 'error')[]
  alert?: boolean
}

const b = BEM('text', styles)

export const UiText = React.forwardRef(function<W extends keyof JSX.IntrinsicElements = 'div'>(
  props: TextProps<W> & Omit<JSX.IntrinsicElements[W], 'style'> & Props<any>,
  ref: ForwardedRef<JSX.IntrinsicElements[W]>,
) {
  let {wrapper, type, block, variants = [], children, clear = [], alert = false} = props
  const cleanProps = {
    ...props,
    clear: undefined, type: undefined, block: undefined, variants: undefined, wrapper: undefined, alert: undefined,
  }

  if (type === 'p') {
    wrapper ??= 'p' as any
  }

  const Wrapper: any = wrapper || ((block || alert) ? 'div' : 'span')
  const modifiers: any[] = [type, ...variants]

  if (alert) {
    modifiers.push('alert' as any)
  }
  if (clear.length) {
    modifiers.push('clear', ...clear.map(_ => `clear-${_}`))
  }

  return (
    <Wrapper ref={ref} {...cleanProps} className={extendClassName(props, b(modifiers))}>
      {children}
    </Wrapper>
  )
})
