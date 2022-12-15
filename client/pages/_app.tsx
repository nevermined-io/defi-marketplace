import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import '../src/styles/styles.scss'
import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Catalog, AuthToken, AssetService, Config } from '@nevermined-io/catalog-core'
import { WalletProvider, getClient } from "@nevermined-io/catalog-providers";
import { Logger } from '@nevermined-io/nevermined-sdk-js'
import { ethers } from 'ethers'
import { UiHeader, UiHeaderLink, UiFooter } from 'ui'
import { UiDivider } from '@nevermined-io/styles'
import UserProvider from '../src/context/UserProvider'

import {
  marketplaceUri,
  neverminedNodeUri,
  neverminedNodeAddress,
  faucetUri,
  web3ProviderUri,
  verbose,
  graphUrl,
  artifactsFolder,
  CORRECT_NETWORK_ID,
  SUPPORTED_NETWORKS,
} from 'src/config'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../src/components/toast/toast.scss'

const appConfig: Config = {
  web3Provider:
    typeof window !== 'undefined'
      ? window?.ethereum
      : new ethers.providers.JsonRpcProvider(web3ProviderUri),
  web3ProviderUri,
  marketplaceUri,
  neverminedNodeUri,
  faucetUri,
  newGateway: true,
  neverminedNodeAddress,
  verbose,
  marketplaceAuthToken:
    typeof window !== 'undefined' ? AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token : '',
  artifactsFolder,
  graphHttpUri: graphUrl
}


function App({ Component, pageProps }: AppProps) {
  Logger.setLevel(3)
  const MainComponent = Component as any

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Catalog.NeverminedProvider config={appConfig}>
        <WalletProvider
          client={getClient(
            'defi-marketplace',
            true,
            SUPPORTED_NETWORKS.filter(network => network.id === CORRECT_NETWORK_ID)
          )}
          correctNetworkId={CORRECT_NETWORK_ID}
        >

          <AssetService.AssetPublishProvider>
            <UserProvider>
              <Head>
                <script
                  async
                  src="https://www.googletagmanager.com/gtag/js?id=G-11ZZZNJ4Q5"
                ></script>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments)}
                  gtag('js', new Date());

                  gtag('config', 'G-11ZZZNJ4Q5');
                `
                  }}
                ></script>
                <title>Nevermined DeFi Marketplace</title>
                <meta name="description" content="Nevermined DeFi Marketplace" />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <div>
                <UiHeader>
                  <UiHeaderLink href="/list">Marketplace</UiHeaderLink>
                  <UiHeaderLink href="/subscription">Subscriptions</UiHeaderLink>
                </UiHeader>

                <MainComponent {...pageProps} />
              </div>

              <UiDivider flex />
              <UiFooter />
            </UserProvider>
          </AssetService.AssetPublishProvider>
        </WalletProvider>
      </Catalog.NeverminedProvider>
    </div>
  )
}
export default App
