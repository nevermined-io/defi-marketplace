import '../src/styles/globals.scss'

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { UiHeader, UiText, UiButton, UiHeaderLink, UiFooter, UiDivider } from 'ui'

import UserProvider from '../src/context/UserProvider'
import { User } from '../src/context'

function App({ Component, pageProps }: AppProps) {
  // const context = React.useContext(User)
  return (
    <UserProvider>
      <>
        <Head>
          <title>Nevermined DeFi Marketplace - List</title>
          <meta name="description" content="Nevermined DeFi Marketplace" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div>
          <UiHeader>
            <UiHeaderLink href="/list">List</UiHeaderLink>
            <UiHeaderLink href="/styles">DEV - Styles</UiHeaderLink>
          </UiHeader>

          <Component {...pageProps} />
        </div>

        <UiDivider flex/>
        <UiFooter/>
      </>
    </UserProvider>
  )
}
export default App
