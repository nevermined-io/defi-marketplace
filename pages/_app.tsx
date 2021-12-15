import '../src/styles/globals.scss'

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { NeverminedProvider } from '@nevermined-io/components-catalog'

import { UiHeader, UiText, UiButton, UiHeaderLink, UiFooter, UiDivider } from 'ui'

import UserProvider from '../src/context/UserProvider'
import { User } from '../src/context'

import * as config from '../src/config'

import { Config } from '@nevermined-io/nevermined-sdk-js';

const defaultConfig = {
  ...config,
  verbose: true,
} as Config;

function App({ Component, pageProps }: AppProps) {
  return (
    <NeverminedProvider config={defaultConfig}>
      <UserProvider>
        <>
          <Head>
            <title>Nevermined DeFi Marketplace - List</title>
            <meta name="description" content="Nevermined DeFi Marketplace" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div>
            <UiHeader>
              <UiHeaderLink href="/history">History</UiHeaderLink>
              <UiHeaderLink href="/styles">DEV - Styles</UiHeaderLink>
            </UiHeader>

            <Component {...pageProps} />
          </div>

          <UiDivider flex/>
          <UiFooter/>
        </>
      </UserProvider>
    </NeverminedProvider>
  )
}
export default App
