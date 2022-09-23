import React, { useEffect, useState } from 'react'
import { BEM } from '@nevermined-io/styles'
import styles from './markdown.module.scss'

const b = BEM('markdown', styles)

interface MarkdownProps {
  code: React.ReactElement | string
  height?: string
  disableCopy?: boolean
}

export const Markdown: React.FC<MarkdownProps> = ({ code, height, disableCopy }: MarkdownProps) => {
  const [navigatorInstance, setNavigatorInstance] = useState<any>(null)

  useEffect(() => {
    if (navigator) {
      setNavigatorInstance(navigator)
    }
  }, [])

  const copyToClipboard = (code: React.ReactElement | string) => {
    const replaced = code.toString().replace('$', '')
    navigatorInstance?.clipboard.writeText(replaced)
  }

  return (
    <div className={b()}>
      <div className={b('header')}>
        <div className={b('header-row')} style={disableCopy ? { visibility: 'hidden' } : {}}>
          <img onClick={() => copyToClipboard(code)} src="/assets/copy_logo.png" />
          <div onClick={() => copyToClipboard(code)} className={b('copy-text')}>
            Copy
          </div>
        </div>
      </div>
      <div className={b('content')} style={{ height: height }}>
        <div className={b('snippet')} style={{ lineHeight: '30px' }}>
          {code}
        </div>
      </div>
    </div>
  )
}
