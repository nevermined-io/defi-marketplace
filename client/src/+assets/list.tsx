import React, { useCallback } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

import { UiText, UiLayout, XuiAssetsQuery } from 'ui'
import { User } from '../context'
import { AssetsList } from './assets-list'

import styles from './list.module.scss'

export const List: NextPage = () => {
  const renderAssets = useCallback(assets => (<AssetsList assets={assets}/>), [])

  return (
    <>

      <UiLayout type="container">
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>

        <XuiAssetsQuery
          search="onsite"
          content={renderAssets}/>
      </UiLayout>
    </>
  )
}