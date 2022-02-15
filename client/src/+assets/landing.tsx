import React from 'react'
import Router from 'next/router'
import type { NextPage } from 'next'
import Image from 'next/image'

import { UiText, UiLayout, UiButton, UiDivider, BEM, UiIcon } from 'ui'

import styles from './landing.module.scss'
import { UiBanner } from 'ui/banner/banner'
import { discordUrl, networkArray } from 'src/config'


export const Landing: NextPage = () => {
  const b = BEM('landing', styles)
  const redirectToDiscord = () => {
    const win = window.open(discordUrl, "_blank");
    win?.focus();
  }
  const redirectToList = () => {
    Router.push('/list')
  }
  const redirectToAbout = () => {
    Router.push('/about')
  }
  const redirectToCli= () => {
    Router.push('/cli')
  }
  return (
    <>
      <UiBanner showButton={true} />
      <UiDivider type="l"/>
      <div className={b('centered-text-wrapper')}>
        <UiText wrapper="h2" type="h2" className={b("centered-text")} style={{ width: '726px' }}>
          Purchase data sets from your favorite networks
        </UiText>
      </div>
      <UiDivider type="xxl" />
      <UiDivider type="m" />

      <UiLayout type="container" >
        <UiLayout type="sides" >
          <UiLayout type="container"  >
            <div  >
              <UiIcon icon="search" color="primary" size="xl" />
              <UiText className={b("blurriedNumbers")} type="h1" variants={["highlight"]}>1</UiText>

              <UiDivider type="s" />

              <UiText type="h4" variants={["secondary"]}>
                Search
              </UiText>

              <UiDivider type="s" />

              <UiText type="p" variants={["detail"]}>
                Identify your desired product by using Nevermined’s filter functions to select  the data set you wish to purchase.
              </UiText>
            </div>
          </UiLayout>
          <UiLayout type="container" >
            {/* <UiIcon icon="basket" color="primary" size="xl" /> */}
            <Image width="40" height="40" className={b('landingImage')} src="/assets/basket_icon.svg" />
            <UiText className={b("blurriedNumbers")} type="h1" variants={["highlight"]}>2</UiText>
            <UiDivider type="s" />
            <UiText type="h4" variants={["secondary"]}>
              Shop
            </UiText>
            <UiDivider type="s" />
            <UiText type="p" variants={["detail"]}>
              Connect your wallet (Polygon or MetaMask) before adding the selected data sets to your basket.
            </UiText>
          </UiLayout>
          <UiLayout type="container" >
            <UiIcon icon="download" color="primary" size="xl" />
            <UiText className={b("blurriedNumbers")} type="h1" variants={["highlight"]}>3</UiText>
            <UiDivider type="s" />
            <UiText type="h4" variants={["secondary"]}>
              Download
            </UiText>
            <UiDivider type="s" />
            <UiText type="p" variants={["detail"]}>
              Head to the check out page to make payment and simply dowload your CSV files.
            </UiText>
          </UiLayout>
        </UiLayout>
        <div className={b("bannerContainer")}>
        <UiButton className={b("buttonFeatures")} onClick={redirectToList}>
          View Available Data Sets
        </UiButton>
        </div>
        <UiDivider type="xxl" />
        <div className={b('centered-text-wrapper')}>
          <UiText wrapper="h2" type="h2" className={b("centered-text")} style={{ width: '543px' }}>
            Say Goodbye to Unstructured Data
          </UiText>
        </div>
        <UiText
          className={b('featureSectionText')}
          style={{ margin: '40px 0' }}
          type="p"
          variants={["secondary", "detail"]}
        >The Nevermined DeFi Marketplace<br />features datsets from your favorite networks, these include:</UiText>
        <div className={b('network-logos-wrapper')}>
          <div className={b('network-logos')}>

            {networkArray.map((network: string) =>
              <img
                onClick={() => Router.push(`/list?selectedNetworks=${network}`)}
                src={`/assets/logos/${network}.svg`}
                style={{ cursor: 'pointer' }}
                width="68"
              />
            )}
          </div>
        </div>
        <UiDivider type="xxl" />
        <div className={b('centered-text-wrapper')}>
          <UiText wrapper="h2" type="h2" className={b("centered-text")}>
            your one-stop-shop for defi data
          </UiText>
        </div>
        <UiText
          className={b('featureSectionText')}
          style={{ margin: '40px 0' }}
          type="p"
          variants={["secondary", "detail"]}
        >All the ways you can discover and navigate data<br />
          on the Nevermined DeFi data marketplace</UiText>

        <div>
          <UiLayout type="sides"  >
            <UiLayout type="grid" align="center" direction="column">
              <Image width="124" height="126" className={b('landingImage')} src="/assets/documents.svg" />
              <UiText className={b('bannerText')} variants={["secondary"]} wrapper="h3" type="h3">Publish & Purchase</UiText>
              <UiDivider />
              <UiText className={b('featureSectionText')} type="p" variants={["secondary", "detail"]}>Whether you’re  publishing DeFi data or purchasing it, our marketplace enables individuals and organizations to leverage value from tokenized data assets.</UiText>
            </UiLayout>
            <UiLayout type="grid" align="center" direction="column">
              <Image width="124" height="126" className={b('landingImage')} src="/assets/analysis.svg" />
              <UiText className={b('bannerText')} variants={["secondary"]} wrapper="h3" type="h3">Analysis Ready Data</UiText>
              <UiDivider />

              <UiText className={b('featureSectionText')} type="p" variants={["secondary", "detail"]}>We ensure that the data sets availiable on our platform are normalized for analtyical purposes, enabling usability regardless of proficiency in blockchain or DeFi.</UiText>
            </UiLayout>
          </UiLayout>

          <UiDivider type="xxl" />

          <UiLayout type="sides" >
            <UiLayout type="grid" align="center" direction="column">
              <Image width="124" height="126" className={b('landingImage')} src="/assets/filtering.svg" />
              <UiText className={b('bannerText')} variants={["secondary"]} wrapper="h3" type="h3">Precision Filtering & Search</UiText>
              <UiDivider />
              <UiText className={b('featureSectionText')} type="p" variants={["secondary", "detail"]}>Our practical search engine and filtering capabilities allow you to intuitively find the data sets you’re looking  and save them to your basket until you’re ready to check out.</UiText>
            </UiLayout>
            <UiLayout type="grid" align="center" direction="column">
              <Image width="124" height="126" className={b('landingImage')} src="/assets/compatibility.svg" />
              <UiText className={b('bannerText')} variants={["secondary"]} wrapper="h3" type="h3">Crypto Wallet Compatibility</UiText>
              <UiDivider />
              <UiText className={b('featureSectionText')} type="p" variants={["secondary", "detail"]}>Nevermined easily integrates with Polygon and Metamask wallets in order to enable efficient user experience. Simply connect your wallet to purchase your data.</UiText>
            </UiLayout>
          </UiLayout>
        </div>
        <UiDivider type="xxl" />
        <div className={b('centered-text-wrapper')}>
          <UiText wrapper="h2" type="h2" className={b("centered-text")}>
            search using your command line
          </UiText>
        </div>
        <div style={{ paddingTop: '22px' }} className={b("bannerContainer")}>
          <UiText type="p" variants={["secondary", "detail"]}>
            I don’t need your shiny interface and search filters
          </UiText>
          <UiButton className={b("buttonFeatures")} onClick={redirectToCli} style={{ marginTop: '22px' }}>
            install Nevermined cli
          </UiButton>
        </div>
      </UiLayout>
      <UiDivider type="xxl" />

      <div className={b('key-insights')}>
        <div className={b('key-insights-text')}>
          <UiLayout type="container" style={{ padding: '0' }}>
            <UiText wrapper="h2" type="h2" className={b("defaultMargin")}>
              Access key insights<br/>in defi & web 3
            </UiText>
            <UiText style={{ marginBottom: '0' }} className={b('defaultMargin')} type="p" variants={["detail"]}>
              Gain the advantage in your Defi analysis and investment models by obtaining data sets aggregated daily from leading protocols such as Ethereum and IPFS.* From DeFi lending and historical DEX events, we make normalized datasets avalaible for download, so that you don’t have to run conversions when performing data analysis.
              <br/><br/>
              The Nevermined DeFi Marketplace supports the following categories:
            </UiText>
            <div style={{ display: 'flex', margin: '5px 0 20px' }}>
              <ul className={b('categories-list')} style={{ listStyleType: 'square' }}>
                <li onClick={() => Router.push('/list?selectedCategories=Borrows')}>Borrows</li>
                <li onClick={() => Router.push('/list?selectedCategories=Deposits')}>Deposits</li>
                <li onClick={() => Router.push('/list?selectedCategories=Flashloans')}>Flashloans</li>
                <li onClick={() => Router.push('/list?selectedCategories=Liquidations')}>Liquidations</li>
              </ul>
                <ul className={b('categories-list')} style={{ listStyleType: 'square' }}>
                <li onClick={() => Router.push('/list?selectedCategories=Redeems')}>Redeems</li>
                <li onClick={() => Router.push('/list?selectedCategories=Repays')}>Repays</li>
                <li onClick={() => Router.push('/list?selectedCategories=Liquidity')}>Liquidity</li>
                <li onClick={() => Router.push('/list?selectedCategories=Trades')}>Trades</li>
              </ul>
            </div>
            <UiLayout type="container" >
              <UiButton className={b("buttonFeatures")} onClick={redirectToAbout}>
                About Us
              </UiButton>
            </UiLayout>
          </UiLayout>
        </div>
        <div className={b('graphs-wrapper')}>
          <Image width="430" height="325" className={b('landingImage')} src="/assets/graphs.svg" />
        </div>
      </div>
      <UiDivider type="xxl" />
      <div className={b('key-insights')}>
        <div className={b('eclipse-wrapper')}>
          <Image width="430" height="325" className={b('landingImage')} src="/assets/planetEclipse.svg" />
        </div>
        <div className={b('get-involved-text')}>
          <UiLayout type="container" style={{ padding: '0' }}>
            <UiText wrapper="h2" type="h2" className={b("defaultMargin")}>
              get involved with<br/>
              our open source community
            </UiText>
            <UiText className={b('defaultMargin')} type="p" variants={["detail"]}>
              The Nevermined DeFi data marketplace aims to bridge the gap between Decentralized Finance (DeFi) and data analytics.
              <br/><br/>
              Our vision is to foster a collaborative ecosystem that helps data analysts to search for, purchase and propose DeFi, blockchain and Web 3 protocol related data sets.
            </UiText>
            <UiLayout type="container" >
              <UiButton className={b("buttonFeatures")} onClick={redirectToDiscord}>
                Join our discord
              </UiButton>
            </UiLayout>
          </UiLayout>
        </div>
      </div>

      <UiLayout type="container" align="center" >
        <div className={b("bannerContainer")}>
          <UiLayout className={b("bannerContainer")} type="container"   >
            {/* <UiLayout className="bannerContainer" type="container" justify="center" > */}
            <UiText wrapper="h2" type="h2">
              Partners
            </UiText>
            <UiDivider type="xl" />
            <div style={{ display: 'flex', justifyContent: 'center' }} >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '705px' }} >
                <div><Image width="181" height="49" className={b('landingImage')} src="/assets/filecoin_logo.svg" /></div>
                <div><Image width="133" height="67" className={b('landingImage')} src="/assets/keyko_logo.svg" /></div>
                <div><img width="226" height="91" className={b('landingImage')} src="/assets/logos/nevermined_text.png" /></div>
              </div>
            </div>
          </UiLayout>
        </div>
      </UiLayout>
    </>
  )
}
