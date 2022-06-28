import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import '../src/styles/styles.scss'
import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import Catalog from '@nevermined-io/components-catalog'
import Web3 from 'web3';
import { UiHeader, UiHeaderLink, UiFooter } from 'ui'
import { UiDivider } from '@nevermined-io/styles'
import UserProvider from '../src/context/UserProvider'
import { docsUrl,
    marketplaceUri,
    gatewayUri,
    gatewayAddress,
    faucetUri,
    nodeUri,
    secretStoreUri,
    verbose,
    graphUrl,
    artifactsFolder
} from 'src/config'

const appConfig = {
    web3Provider: new Web3(new Web3.providers.HttpProvider(nodeUri)),
    nodeUri,
    marketplaceUri,
    gatewayUri,
    faucetUri,
    gatewayAddress,
    secretStoreUri,
    verbose,
    marketplaceAuthToken: typeof window !== 'undefined' ?  localStorage.getItem('marketplaceApiToken') || '' : '',
    artifactsFolder,
    graphHttpUri: graphUrl
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Catalog.NeverminedProvider config={appConfig}>
      <UserProvider>
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
            <UiHeaderLink href="/about">About</UiHeaderLink>
            <UiHeaderLink href={docsUrl} target='_blank'>Docs</UiHeaderLink>
          </UiHeader>

          <Component {...pageProps} />
        </div>

        <UiDivider flex />
        <UiFooter />
    </UserProvider>
    </Catalog.NeverminedProvider>
  )
}
export default App
