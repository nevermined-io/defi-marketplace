import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { User } from '../context'
import { AssetsList } from './assets-list'


import { UiText, UiLayout } from 'ui'

export const History: NextPage = () => {
  const [assets, setAssets] = useState<DDO[]>([])
  const {sdk, account} = useContext(User)

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    // TODO: consumerAssets to get consumer assets 
    sdk.assets.ownerAssets(account)
      .then(async dids => {
        setAssets(await Promise.all(
          dids.map(did => sdk.assets.resolve(did))
        ))
      })
  }, [sdk])

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>History</UiText>
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>

        <AssetsList assets={assets}/>
      </UiLayout>
    </>
  )
}