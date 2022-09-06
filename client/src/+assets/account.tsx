import type { NextPage } from 'next'
import React, { useEffect, useState, useContext } from 'react'
import { UiText, UiDivider, UiLayout, BEM, UiButton } from '@nevermined-io/styles'
import styles from './account.module.scss'
import { UserProfile } from './user-profile'
import { User } from '../context'
import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { loadUserPublished, loadUserDownloads } from 'src/shared/graphql'
import { Summary } from 'ui/+account/summary'
import { AssetsList } from './assets-list'
import Router from 'next/router'
import { toast } from 'react-toastify'

const b = BEM('account', styles)
export const Account: NextPage = () => {
  const [view, setView] = useState<number>(0)
  const [published, setPublished] = useState<DDO[]>([])
  const [downloaded, setDownloaded] = useState<DDO[]>([])
  const { bookmarks, setBookmarks, getCurrentUserSubscription } = useContext(User)
  const { sdk } = Catalog.useNevermined()
  const { walletAddress } = MetaMask.useWallet()
  const subscriptionErrorText = "You don't have any current subscription. Only users with a subscription are allowed to publish"

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

    const downloaded = await loadUserDownloads(sdk, walletAddress)
    const downloadedDDO = await Promise.all(
      downloaded.map(async (asset: any) => await sdk.assets.resolve(asset._did))
    )

    setBookmarks(bookmarksDDO)
    setPublished(publishedDDO)
    setDownloaded(downloadedDDO)
  }

  useEffect(() => {
    if (!sdk?.profiles) {
      return
    }
    loadUserInfo()
  }, [sdk])

  const publishAsset = () => {
    if (!getCurrentUserSubscription()) {
      toast.error(subscriptionErrorText)
      return
    }
    Router.push('/user-publish')
  }

  const renderContent = () => {
    if (view == 0) {
      return <Summary published={published} bookmarks={bookmarks} downloaded={downloaded} currentSubscription= {getCurrentUserSubscription()?.tier || ''}/>
    } else if (view == 1) {
      return <UserProfile />
    } else if (view == 2) {
      return <AssetsList assets={bookmarks} />
    } else if (view == 3) {
      return (
        <>
          <UiButton onClick={() =>publishAsset()}>Publish new asset</UiButton>
          <AssetsList assets={published} disableBatchSelect={true} />
        </>
      )
    } else if (view == 4) {
      return <AssetsList assets={downloaded} disableBatchSelect={true} />
    } else if (view == 5) {
      return (
        <>    
        {
          getCurrentUserSubscription()?<h1>{getCurrentUserSubscription()?.tier}</h1>:<h1>No subscriptions yet</h1>
        }         
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
              Downloads
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
