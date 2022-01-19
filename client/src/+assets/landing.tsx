import React, { useCallback } from 'react'
import Router from 'next/router'
import type { NextPage } from 'next'
import Image from 'next/image'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { UiText, UiLayout, XuiAssetsQuery, UiButton, UiDivider, BEM, UiIcon } from 'ui'
import { User } from '../context'
import { AssetsList } from './assets-list'

import styles from './landing.module.scss'
import { UiBanner } from 'ui/banner/banner'

export const Landing: NextPage = () => {
  const b = BEM('landing', styles)
  const redirectToList = () => {
    Router.push('/list')
  }
  return (
    <>
      <UiBanner showButton={true}/>

      {/* first section */}
      <UiLayout type="grid"  >
        <div>
          <UiLayout type="grid"  >
            <Image width="430" height="325" className={b('landingImage')} src="/assets/planetEclipse.svg" />
          </UiLayout>
        </div>
        <div>
          <UiLayout type="container" >
            <UiText wrapper="h2" type="h2" className={b("defaultMargin")}>
              A Collaborative data Marketplace
            </UiText>
            <UiText className={b('defaultMargin')} type="p" variants={["detail"]}>
              The Nevermined DeFi data marketplace bridges the gap between
              Decentralized Finance (DeFi) and data analytics.
              We aim to foster a collaborative ecosystem that
              helps data analysts to search for, purchase and
              propose DeFi, blockchain and Web 3 protocol related data sets.
            </UiText>
            <UiLayout type="container" >
              <UiButton className={b("buttonFeatures")} onClick={redirectToList}>
                Join our discord
              </UiButton>
            </UiLayout>
          </UiLayout>
        </div>
      </UiLayout>

      <UiLayout type="grid" >
        <div>
          <UiLayout type="container" >
            <UiText wrapper="h2" type="h2" className={b("defaultMargin")}>
              Access key insights <br /> in
              <UiText clear={['text-transform']} > DeFi  </UiText>
              & web 3
            </UiText>
            <UiText className={b("defaultMargin")} type="p" variants={["detail"]}>
              Gain the advantage in your Defi analysis and investment models by
              obtaining data sets aggregated daily from leading protocols such as
              Ethereum and IPFS.* From DeFi lending and historical DEX events,
              we make normalized datasets avalaible for download, so that you don’t have
              to run conversions when performing data analysis.
            </UiText>
            <UiLayout type="container" >
              <UiButton className={b("buttonFeatures")} onClick={redirectToList}>
                search data sets
              </UiButton>

            </UiLayout>
          </UiLayout>
        </div>
        <div>
          <UiLayout type="grid" >
            <Image width="430" height="325" className={b('landingImage')} src="/assets/graphs.svg" />
          </UiLayout>
        </div>
      </UiLayout>

      {/* 2nd section  */}
      <UiLayout type="container" align="center" >
        <div className={b("bannerContainer")}>
          <UiLayout className={b("bannerContainer")} type="container"   >
            {/* <UiLayout className="bannerContainer" type="container" justify="center" > */}
            <UiText wrapper="h2" type="h2">
              FEATURES
            </UiText>
            <UiDivider />
            <UiText type="p" variants={["detail"]}>
              All the ways you can discover and navigate data on the Nevermined marketplace
            </UiText>
          </UiLayout>
        </div>
        <UiDivider type="xxl" />

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
      </UiLayout>
      <div className={b("bannerContainer")}>
        <UiButton onClick={redirectToList}>
          GO TO MARKETPLACE
        </UiButton>
      </div>
      <UiDivider type="s" />


      {/* 3rd section */}
      <UiLayout type="container" >
        <div className={b("bannerContainer")}>
          <UiLayout className={b("bannerContainer")} type="container"   >
            {/* <UiLayout className="bannerContainer" type="container" justify="center" > */}
            <UiText wrapper="h2" type="h2">
              HOW IT WORKS
            </UiText>
            <UiDivider type="l" />
            <UiText wrapper="h3" variants={["detail"]}>
              Purchasing DeFi data through Nevermined’s open marketplace is as easy as 1,2,3...
            </UiText>
          </UiLayout>
          <UiDivider type="xl" />
        </div>
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
            install Nevermined cli
          </UiButton>
          <UiDivider type="s" />
          <UiText type="p" variants={["secondary", "detail"]}>
            (If you don’t want to bother with our interface)
          </UiText>
        </div>
      </UiLayout>


      {/* 4th section */}
      <UiLayout type="container" align="center" >
        <div className={b("bannerContainer")}>
          <UiLayout className={b("bannerContainer")} type="container"   >
            {/* <UiLayout className="bannerContainer" type="container" justify="center" > */}
            <UiText wrapper="h2" type="h2">
              Partners
            </UiText>
            <UiDivider type="l" />
            <UiLayout type="grid" >
              <Image width="125" height="55" className={b('landingImage')} src="/assets/keyko_logo.svg" />
              <Image width="125" height="55" className={b('landingImage')} src="/assets/filecoin_logo.svg" />

            </UiLayout>
          </UiLayout>
        </div>
      </UiLayout>
    </>
  )
}