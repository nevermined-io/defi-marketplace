import React from 'react'
import { BEM, UiDivider, UiLayout, UiText } from '@nevermined-io/styles'
import Link from 'next/link'
import Image from 'next/image'
import styles from './footer.module.scss'

const b = BEM('footer', styles)

export function UiFooter() {
  return (
    <footer className={b()}>
      <UiLayout type="container">
        <UiDivider type="xl" />
        <UiLayout className={b('link-row')}>
          <a href="https://www.nevermined.io/" target="_blank" rel="noopener noreferrer">
            <Image width="39" height="24" className={b('logo')} src="/assets/nevermined.svg" />
          </a>
        </UiLayout>
        <UiDivider type="l" />
        <UiLayout className={b('link-row')}>
          <Link href="/about">
            <a>
              <UiText className="pointer" type="link-caps" variants={['detail']}>
                About
              </UiText>
            </a>
          </Link>
          <UiDivider vertical type="l" />
          <Link href="/status">
            <a>
              <UiText className="pointer" type="link-caps" variants={['detail']}>
                Status
              </UiText>
            </a>
          </Link>
          <UiDivider vertical type="l" />
          <Link href="/docs">
            <a>
              <UiText className="pointer" type="link-caps" variants={['detail']}>
                Docs
              </UiText>
            </a>
          </Link>
        </UiLayout>
      </UiLayout>
      <UiDivider type="l" />
      <UiLayout type="sides" align="center" className={b('content', ['secondary'])}>
        <UiText type="small" variants={['detail']} className={b('link-column')}>
          Keyko DeFi Marketplace {new Date().getUTCFullYear()} • All rights reserved
        </UiText>
        <UiLayout className={b('link-column', ['middle'])}>
          <a href="https://discord.gg/uyCT8ZmJNj" target="_blank" rel="noopener noreferrer">
            <Image width="27" height="27" className={b('logo')} src="/assets/discord.svg" />
          </a>
          <UiDivider vertical type="l" />
          <a href="https://www.keyko.io/" target="_blank" rel="noopener noreferrer">
            <Image width="27" height="27" className={b('logo')} src="/assets/github.svg" />
          </a>
        </UiLayout>
        <UiLayout className={b('link-column', ['last'])}>
          <Link href="/terms">
            <a>
              <UiText type="small" variants={['detail']}>
                Terms & Conditions
              </UiText>
            </a>
          </Link>
        </UiLayout>
      </UiLayout>
    </footer>
  )
}
