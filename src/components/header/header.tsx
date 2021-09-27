import React, { Props } from "react"
import { useRouter } from "next/router";
import { BEM, UiDivider, UiLayout, UiButton, UiText, XuiWallet } from "ui"
import Link from "next/link"
import Image from "next/image"

import styles from './header.module.scss'

const b = BEM('header', styles)

interface HeaderLinkProps {
  href: string
  children: string
}

export function UiHeaderLink({href, children}: HeaderLinkProps) {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link href={href}>
      <span>
        <UiText
          className={`pointer ${b('link', {active})}`}
          type="link-caps"
          variants={active ? [] : ['highlight']}>

          {children}
        </UiText>
      </span>
    </Link>
  )
}

interface HeaderProps {
  logoHref?: string
  children?: (typeof UiHeaderLink)[]
}

export function UiHeader({logoHref, children}: HeaderProps) {
  return (
    <header className={b()}>
      <UiLayout align="center" className={b('content')}>
        <Link href={logoHref || '/'}>
          <span>
            <Image width="39" height="24" className={b('logo')} src="/assets/nevermined.svg"/>
          </span>
        </Link>

        <UiDivider flex/>

        <UiLayout>{children}</UiLayout>

        <XuiWallet/>
      </UiLayout>
    </header>
  )
}
