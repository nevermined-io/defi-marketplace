import React, { useContext, useCallback } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

import { User } from '../context'
import { AssetsList } from './assets-list'
import { graphService } from 'src/shared/services'

import { UiText, UiLayout, XuiAssetsQuery } from 'ui'

export const History: NextPage = () => {
  const {sdk, account, consumableAssets} = useContext(User)

  const renderAssets = useCallback(assets => (<AssetsList assets={assets}/>), [])

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>History</UiText>
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>

        {!!consumableAssets.length && (
          <XuiAssetsQuery
            query={{did: consumableAssets}}
            skipDefi
            content={renderAssets}/>
        )}
      </UiLayout>
    </>
  )
}
