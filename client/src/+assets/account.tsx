import type { NextPage } from 'next'
import React, { useEffect, useState, useContext } from 'react'
import { UiText, UiDivider, UiLayout, BEM, UiButton } from '@nevermined-io/styles'
import styles from './account.module.scss'
import { UserProfile } from './user-profile'
import { User } from '../context'
import Catalog from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { loadFullfilledEvents, loadUserPublished } from 'src/shared/graphql'
import { Summary } from 'ui/+account/summary'
import { AssetsList } from './assets-list'
import Router from 'next/router'

const b = BEM('account', styles)
export const Account: NextPage = () => {
  const [view, setView] = useState<number>(0)
  const [published, setPublished] = useState<DDO[]>([])
  const [purchased, setPurchased] = useState<DDO[]>([])
  const { bookmarks, setBookmarks } = useContext(User)
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()

  const loadUserInfo = async () => {
    const userProfile = await sdk.profiles.findOneByAddress(walletAddress)
    const bookmarks = await sdk.bookmarks.findManyByUserId(userProfile.userId)

    const bookmarksDDO = await Promise.all(
      bookmarks.results?.map((bookmark) => sdk.assets.resolve(bookmark.did))
    )

    const published = await loadUserPublished(sdk, walletAddress)

    const publishedDDO: DDO[] = await Promise.all(
      published.map((asset: any) => sdk.assets.resolve(asset._did))
    )

    const purchased = await loadFullfilledEvents(sdk, walletAddress)

    const purchasedDDO = await Promise.all(
      purchased.map((asset: any) => sdk.assets.resolve(asset.documentId))
    )

    setBookmarks(bookmarksDDO)
    setPublished(publishedDDO)
    setPurchased(purchasedDDO)
  }

  useEffect(() => {
    if (!sdk?.profiles) {
      return
    }
    loadUserInfo()
  }, [sdk])

  const renderContent = () => {
    if (view == 0) {
      return <Summary published={published} bookmarks={bookmarks} purchased={purchased} />
    } else if (view == 1) {
      return <UserProfile />
    } else if (view == 2) {
      return <AssetsList assets={bookmarks} />
    } else if (view == 3) {
      return (
        <>
          <UiButton onClick={() => Router.push('/user-publish')}>Publish new asset</UiButton>
          <AssetsList assets={published} disableBatchSelect={true} />
        </>
      )
    } else if (view == 4) {
      return <AssetsList assets={purchased} disableBatchSelect={true} />
    } else if (view == 5) {
      return (
        <>
          <h1>No subscriptions yet</h1>
        </>
      )
    }
  }

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>
          Your Account
        </UiText>
        <div className={b('row')}>
          <div className={b('columnleft')}>
            <UiText
              className={b('pointer', view === 1 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(1)}
            >
              Profile
            </UiText>
            <UiDivider />
            <UiText
              className={b('pointer', view === 2 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(2)}
            >
              Bookmarks
            </UiText>
            <UiDivider />
            <UiText
              className={b('pointer', view === 3 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(3)}
            >
              Published Assets
            </UiText>
            <UiDivider />
            <UiText
              className={b('pointer', view === 4 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(4)}
            >
              Purchases
            </UiText>
            <UiDivider />
            <UiText
              className={b('pointer', view === 5 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(5)}
            >
              Subscriptions
            </UiText>
          </div>
          <div className={b('columnright')}>{renderContent()}</div>
        </div>
      </UiLayout>
    </>
  )
}
