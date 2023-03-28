import '@nevermined-io/styles/lib/esm/styles/globals.scss'
import '@nevermined-io/styles/lib/esm/index.css'
import '../src/styles/styles.scss'
import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Catalog, AuthToken, AssetService } from '@nevermined-io/catalog'
import { WalletProvider, Wagmi, ConnectKit, Chains } from "@nevermined-io/providers";
import { Logger } from '@nevermined-io/sdk'
import { ethers } from 'ethers'
import { UiHeader, UiHeaderLink } from '../src/components/header/header'
import { UiFooter } from '../src/components/footer/footer'
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
} from 'src/config'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../src/components/toast/toast.scss'

export const chainConfig: Wagmi.Chain[] = [
  Chains.polygonMumbai,
  Chains.polygon,
  {
    id: 1337,
    name: 'Localhost development',
    network: 'spree',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['http://localhost:8545'],
      },
      public: {
        http: ['http://localhost:8545'],
      },
    },
    testnet: true,
  },
]


// import { NeverminedOptions } from '@nevermined-io/sdk/dist/node/models/NeverminedOptions'

const appConfig = {
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

const client = Wagmi.createClient(
  ConnectKit.getDefaultClient({
    appName: 'Nevermined One',
    chains: chainConfig,
  }) as any,
)
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
            client={client}
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
                  <meta name="description" content="Nevermined DeFi Marketplace"/>
                  <link rel="icon" href="/favicon.ico"/>
                </Head>
                <div>
                  <UiHeader>
                    <UiHeaderLink href="/list">Marketplace</UiHeaderLink>
                    <UiHeaderLink href="/subscription">Subscriptions</UiHeaderLink>
                  </UiHeader>

                  <MainComponent {...pageProps} />
                </div>

                <UiDivider flex/>
                <UiFooter/>
              </UserProvider>
            </AssetService.AssetPublishProvider>
          </WalletProvider>
        </Catalog.NeverminedProvider>
      </div>
  )
}

export default App
