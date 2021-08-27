import React, { useEffect, useContext, useState, useCallback } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

import { User } from '../context'
import { AssetsList } from './assets-list'

import { UiText, UiLayout, XuiAssetsQuery } from 'ui'

export const History: NextPage = () => {
  const [assets, setAssets] = useState<string[]>([])
  const {sdk, account} = useContext(User)

  useEffect(() => {
    if (!sdk.assets) {
      return
    }
    // TODO: use consumerAssets to get consumer assets 
    sdk.assets.ownerAssets(account)
      .then(setAssets)
  }, [sdk])

  const renderAssets = useCallback(assets => (<AssetsList assets={assets}/>), [])

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>History</UiText>
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>

        <XuiAssetsQuery
          query={{did: assets}}
          content={renderAssets}/>
      </UiLayout>
    </>
  )
}