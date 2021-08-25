import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { User } from '../context'
import { AssetsList } from './assets-list'


import { UiText, UiLayout } from 'ui'
import styles from './list.module.scss'

export const List: NextPage = () => {
  const [assets, setAssets] = useState<DDO[]>([])
  const {sdk} = useContext(User)

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    console.log(sdk)
    const query = {
      offset: 12,
      page: 1,
      query: {
        categories: ['Economy']
      },
      sort: {
        created: -1
      }
    }
    sdk.assets.query(query)
      .then(({results}) => setAssets(results))
  }, [sdk])

  return (
    <>
      <div className={styles.bannerContainer}>
        <Image src="/assets/nevermined-color.svg" width="115" height="70"/>
        <UiText className={styles.bannerText} wrapper="h1" type="h1">
          The Nevermined <br/>
          <UiText clear={['text-transform']}>DeFi</UiText>
          {' '}
          Marketplace
        </UiText>
      </div>

      <UiLayout type="container">
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Projects</UiText>
        </UiLayout>

        <AssetsList assets={assets}/>
      </UiLayout>
    </>
  )
}