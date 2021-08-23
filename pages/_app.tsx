import '../src/styles/globals.scss'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import { UiHeader, UiText, UiButton, UiHeaderLink } from 'ui'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div>
      <Head>
        <title>Nevermined DeFi Marketplace - List</title>
        <meta name="description" content="Nevermined DeFi Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UiHeader>
        <UiHeaderLink href="/list">List</UiHeaderLink>
        <UiHeaderLink href="/styles">DEV - Styles</UiHeaderLink>
      </UiHeader>

      <Component {...pageProps} />
    </div>
  )
}
export default MyApp
