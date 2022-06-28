import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { UiHeader, UiHeaderLink, UiFooter } from 'ui'
import { UiDivider } from '@nevermined-io/styles'

import UserProvider from '../src/context/UserProvider'
import { docsUrl } from 'src/config'

function App({ Component, pageProps }: AppProps) {
  // const context = React.useContext(User)
  return (
    <UserProvider>
      <>
        <Head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-11ZZZNJ4Q5"></script>
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());

              gtag('config', 'G-11ZZZNJ4Q5');
            `
          }}>
          </script>
          <title>Nevermined DeFi Marketplace</title>
          <meta name="description" content="Nevermined DeFi Marketplace" />
          <link rel="icon" href="/favicon.ico" />

        </Head>

        <div>
          <UiHeader>
            <UiHeaderLink href="/list">Marketplace</UiHeaderLink>
            <UiHeaderLink href="/profile">Profile</UiHeaderLink>
            <UiHeaderLink href="/user-profile">Account</UiHeaderLink>
            <UiHeaderLink href="/user-publish">Publish</UiHeaderLink>
            <UiHeaderLink href="/about">About</UiHeaderLink>
            <UiHeaderLink href={docsUrl} target='_blank'>Docs</UiHeaderLink>
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
