import React, { Props, HTMLProps, HTMLAttributes } from 'react'
import { BEM, modList, extendClassName } from 'ui'
import styles from './circle-progress.module.scss'

interface CircleProgressProps {
  progress?: number
  content?: string
}

const size = 244
const stroke = 10

const b = BEM('circle-progress', styles)
export function UiCircleProgress(props: CircleProgressProps & HTMLAttributes<any>) {
  const {progress = 0, content} = props
  const cleanProps = {...props, secondary: undefined}

  return (
    <div {...cleanProps} className={extendClassName(props, b())}>
      <div className={b('content')}>{content}</div>
      <svg
        width={size}
        height={size}
        viewport={`0 0 ${size / 2} ${size / 2}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={b('circle')}
          stroke="url(#nvmGradient)"
          strokeWidth={stroke}
          r={(size - stroke) / 2}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"/>
        <circle
          className={b('circle', ['mask'])}
          strokeWidth={stroke}
          r={(size - stroke) / 2}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={(size - stroke) * Math.PI}
          strokeDashoffset={(size - stroke) * Math.PI * progress}/>
        <defs>
          <linearGradient id="nvmGradient" x1="164.831" y1="281" x2="-38.7029" y2="157.516" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7834F9"/>
            <stop offset="1" stopColor="#67CFF9"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
