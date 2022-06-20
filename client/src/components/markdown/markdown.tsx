import React, { useEffect, useState } from "react"
import { BEM } from "@nevermined-io/styles"
import styles from './markdown.module.scss'

const b = BEM('markdown', styles)

interface MarkdownProps {
  code: React.ElementType
  height: string,
  disableCopy?: boolean
}

export const Markdown: React.FC<MarkdownProps>= ({ code, height, disableCopy }: MarkdownProps) => {

  const [navigatorInstance, setNavigatorInstance] = useState<any>(null);

  useEffect(() => {
    if (navigator) {
      setNavigatorInstance(navigator)
    }
  }, []);

  const copyToClipboard = (code: React.ElementType) => {
    const replaced = code.toString().replace("$", "")
    navigatorInstance?.clipboard.writeText(replaced)
  }

  return (
    <div className="markdown" style={{ margin: "20px 0" }}>
      <div className={b('header')}>
        <div style={disableCopy ? { visibility: 'hidden' } : {}}>
          <img onClick={() => copyToClipboard(code)} src="/assets/copy_logo.png" />
          <div onClick={() => copyToClipboard(code)} className={b('copy-text')}>Copy</div>
        </div>
      </div>
      <div className={b('content')} style={{ height: height }}>
        <div className={b('snippet')} style={{ lineHeight: "30px" }}>
          {code}
        </div>
      </div>
    </div>

  )
}
