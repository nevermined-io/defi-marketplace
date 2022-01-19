import React from "react"
import Router from 'next/router'
import { BEM, UiButton, UiDivider, UiText } from "ui"
import Image from "next/image"
import styles from './banner.module.scss'

const b = BEM('banner', styles)

interface BannerProps {
  showButton: boolean
}

export function UiBanner(props: BannerProps) {

  const redirectToList = () => {
    Router.push('/list')
  }

  return (
    <div className={b('bannerContainer')}>
      <Image src="/assets/nevermined-color.svg" width="115" height="70" />
      <UiText className={b('bannerText', ["padding"])} wrapper="h1" type="h1">
        Discover, Distribute &<br />
        {' '}
        Download
        <UiText clear={['text-transform']} > DeFi  </UiText>
        Data
      </UiText>
      <UiDivider type="s" />
      {
        props.showButton ?
          <div>
          <UiText className={b('bannerText')} variants={["heading", "secondary"]} wrapper="h3" type="h3">
            Say Goodbye to Unstructured Data
          </UiText>
            <UiButton onClick={redirectToList}>
              GO TO MARKETPLACE
            </UiButton>
            <UiDivider type="xxl" />
          </div> :
          
          <UiDivider type="l" />
      }
    </div>
  )
}
