import React, { useEffect } from 'react'
import { BEM, UiLayout, UiText } from 'ui'
import styles from './circle-spinner.module.scss'
import Image from 'next/image'

const b = BEM('spinner', styles)
interface CircleSpinnerProps {
  width: any,
  height: any
}
export function CircleSpinner({width, height} : CircleSpinnerProps) {
  useEffect(()=>{console.log("width, height",width, height)})
  return <UiLayout type="container" className={b("spinner-container")} >
    <UiText className={b("loadspinner")} >
      <Image width={width} height={height} src="/assets/circle-loadspinner.svg" className={b("loadspinner", ["spinner"])} />
    </UiText>
  </UiLayout>
}
