import React from "react"
import { BEM, UiDivider, UiLayout, UiText } from "@nevermined-io/styles"
import Link from "next/link"
import Image from "next/image"
import styles from './footer.module.scss'

const b = BEM('footer', styles)

export function UiFooter() {

  return (
    <footer className={b()}>
      <UiDivider type="l"/>
      <UiLayout type="sides" align="center" className={b('content')}>
        <UiLayout>
          <a href="https://www.nevermined.io/" target="_blank" rel="noopener noreferrer">
            <Image width="39" height="24" className={b('logo')} src="/assets/nevermined.svg"/>
          </a>
          <UiDivider vertical type="l"/>
          <a href="https://www.keyko.io/" target="_blank" rel="noopener noreferrer">
            <Image width="27" height="27" className={b('logo')} src="/assets/keyko.svg"/>
          </a>
        </UiLayout>
        <UiLayout>
          <Link href="/about">
            <UiText className="pointer" type="link-caps" variants={['detail']}>About</UiText>
          </Link>
          <UiDivider vertical type="l"/>
          <Link href="/status">
            <UiText className="pointer" type="link-caps" variants={['detail']}>Status</UiText>
          </Link>
          <UiDivider vertical type="l"/>
          <a href="https://discord.gg/uyCT8ZmJNj" target="_blank" rel="noopener noreferrer">
            <Image width="27" height="27" className={b('logo')} src="/assets/discord.svg"/>
          </a>
        </UiLayout>
      </UiLayout>
      <UiDivider type="xxl"/>
      <UiLayout type="sides" align="center" className={b('content', ['secondary'])}>
        <UiText type="small" variants={['detail']}>
          Nevermined DeFi Marketplace {new Date().getUTCFullYear()} • All rights reserved
        </UiText>
        <Link href="/terms">
          <UiText type="small" variants={['detail']}>
            Terms & Conditions
          </UiText>
        </Link>
      </UiLayout>
    </footer>
  )
}
