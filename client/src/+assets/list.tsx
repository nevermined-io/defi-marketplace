import React, { useCallback } from 'react'
import type { NextPage } from 'next'
import { UiText, UiLayout } from '@nevermined-io/styles'
import { XuiAssetsQuery } from 'ui'
import { AssetsList } from './assets-list'
import { UiBanner } from 'ui/banner/banner'

export const List: NextPage = () => {
  const renderAssets = useCallback((assets) => <AssetsList assets={assets} />, [])

  return (
    <>
      <UiLayout type="container">
        <UiBanner showButton={false} />
        <UiLayout>
          <UiText type="h3" wrapper="h2">
            Browse DeFi Reports
          </UiText>
        </UiLayout>

        <XuiAssetsQuery search="onsite" content={renderAssets} />
      </UiLayout>
    </>
  )
}
