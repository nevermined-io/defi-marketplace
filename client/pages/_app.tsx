import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import '../src/styles/styles.scss'
import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Catalog, AuthToken, AssetService } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { Logger } from '@nevermined-io/nevermined-sdk-js'
import { ethers } from 'ethers'
import { UiHeader, UiHeaderLink, UiFooter } from 'ui'
import { UiDivider } from '@nevermined-io/styles'
import UserProvider from '../src/context/UserProvider'
import {
  docsUrl,
  marketplaceUri,
  gatewayUri,
  gatewayAddress,
  faucetUri,
  nodeUri,
  secretStoreUri,
  verbose,
  graphUrl,
  artifactsFolder,
  correctNetworkId
} from 'src/config'
import chainConfig from 'src/chainConfig'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appConfig = {
  web3Provider:
    typeof window !== 'undefined' ? window?.ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
  nodeUri,
  marketplaceUri,
  gatewayUri,
  faucetUri,
  gatewayAddress,
  secretStoreUri,
  verbose,
  marketplaceAuthToken:
    typeof window !== 'undefined' ? AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token : '',
  artifactsFolder,
  graphHttpUri: graphUrl
}

function App({ Component, pageProps }: AppProps) {
  Logger.setLevel(3)

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
      pauseOnHover/>
    <Catalog.NeverminedProvider config={appConfig}>
      <MetaMask.WalletProvider
        externalChainConfig={chainConfig}
        nodeUri={appConfig.nodeUri}
        correctNetworkId={correctNetworkId}
      >
        <AssetService.AssetPublishProvider>
          <UserProvider>
            <Head>
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-11ZZZNJ4Q5"></script>
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
                <UiHeaderLink href="/subscription">Pricing</UiHeaderLink>
                <UiHeaderLink href="/about">About</UiHeaderLink>
                <UiHeaderLink href={docsUrl} target="_blank">
                  Docs
                </UiHeaderLink>
              </UiHeader>

              <Component {...pageProps} />
            </div>

            <UiDivider flex />
            <UiFooter />
          </UserProvider>
        </AssetService.AssetPublishProvider>
      </MetaMask.WalletProvider>
    </Catalog.NeverminedProvider>
    </div>
  )
}
export default App
