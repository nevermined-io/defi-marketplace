import React, { useCallback } from 'react'
import Router from 'next/router'
import type { NextPage } from 'next'
import Image from 'next/image'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { UiText, UiLayout, XuiAssetsQuery, UiButton, UiDivider } from 'ui'
import { User } from '../context'
import { AssetsList } from './assets-list'

import styles from './landing.module.scss'

export const Landing: NextPage = () => {
  const renderAssets = useCallback(assets => (<AssetsList assets={assets} />), [])
const redirectToList = () =>{
  Router.push('/list')
}
  return (
    <>
      <div className={styles.bannerContainer}>
        <Image src="/assets/nevermined-color.svg" width="115" height="70" />
        <UiText className={styles.bannerText} wrapper="h1" type="h1">
          The Nevermined <br />
          <UiText clear={['text-transform']}>DeFi</UiText>
          {' '}
          Marketplace
        </UiText>
        <UiDivider />
        <UiButton onClick={redirectToList}>
          GO TO MARKETPLACE
        </UiButton>
      </div>

      <UiLayout type="container">
        {/* <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>

        <XuiAssetsQuery
          search="onsite"
          content={renderAssets}/> */}
      </UiLayout>
    </>
  )
}