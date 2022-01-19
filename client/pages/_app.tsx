import '../src/styles/globals.scss'

import React, { useEffect } from 'react'

import { useContext } from 'react'
import Head from 'next/head'
import Image from "next/image"


import type { AppProps } from 'next/app'
import Router from 'next/router'
import { UiHeader, UiText, UiButton, UiHeaderLink, UiFooter, UiDivider } from 'ui'

import UserProvider from '../src/context/UserProvider'
import { User } from '../src/context'
import Link from 'next/link'

function App({ Component, pageProps }: AppProps) {
  // const context = React.useContext(User)
  return (
    <UserProvider>
      <>
        <Head>
          <title>Nevermined DeFi Marketplace</title>
          <meta name="description" content="Nevermined DeFi Marketplace" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>
          <UiHeader>
            <UiHeaderLink href="/list">Marketplace</UiHeaderLink>
            <UiHeaderLink href="/history">Profile</UiHeaderLink>
            <UiHeaderLink href="/styles">About</UiHeaderLink>
            <Link href={'/checkout'} >
              <span style={{ cursor: 'pointer' }}>
                <Image width="39" height="24" src="/assets/basket_icon.svg" />
                {basket.length}
              </span>
            </Link>
          </UiHeader>

          <Component {...pageProps} />
        </div>

        <UiDivider flex />
        <UiFooter />
      </>
    </UserProvider>
  )
}
export default App
