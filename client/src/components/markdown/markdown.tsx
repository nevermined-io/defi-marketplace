import React, { Props } from "react"
import { BEM } from "ui"
import styles from './markdown.module.scss'

const b = BEM('markdown', styles)

interface MarkdownProps {
  code: React.ElementType
  height: string
}

export function Markdown({ code, height }: MarkdownProps) {
  return (
    <div className="markdown" style={{ margin: "20px 0" }}>
      <div className={b('header')}>
        <img src="/assets/copy_logo.png" />
        <div className={b('copy-text')}>Copy</div>
      </div>
      <div className={b('content')} style={{ height: height }}>
        <div className={b('snippet')} style={{ lineHeight: "30px" }}>
          {code}
        </div>
      </div>
    </div>

  )
}
