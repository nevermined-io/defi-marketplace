import React from 'react'
import { BEM } from 'ui'
import styles from './loader.module.scss'

const b = BEM('loader', styles)

export function Loader () {
  return <div className={b('wrapper')}>
    <svg className={b('triangle-canvas')} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <polygon className={`${b('triangle')} ${b('triangle-1')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-2')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-3')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-4')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-5')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-6')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-7')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-8')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-9')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-10')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-11')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-12')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-13')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-14')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-15')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-16')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-17')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-18')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-19')}`} points="500,200 759,650 241,650"/>
      <polygon className={`${b('triangle')} ${b('triangle-20')}`} points="500,200 759,650 241,650"/>
    </svg>
  </div>
}
