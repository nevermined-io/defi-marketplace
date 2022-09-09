import type { NextPage } from 'next'
import React, { useEffect, useState, useContext } from 'react'
import { UiText, UiDivider, UiLayout, BEM, UiButton } from '@nevermined-io/styles'
import styles from './account.module.scss'
import { UserProfile } from './user-profile'
import { User } from '../context'
import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import { loadUserPublished, loadUserDownloads, getUserSubscription } from 'src/shared/graphql'
import { Summary } from 'ui/+account/summary'
import { AssetsList } from './assets-list'
import Router from 'next/router'
import { toast } from 'react-toastify'
import { Subscriptions } from 'ui/+account/subscriptions'

const b = BEM('account', styles)
export const Account: NextPage = () => {
  const [view, setView] = useState<number>(0)
  const [purchaseDate, setPurchaseDate] = useState<Date>(undefined)
  const [published, setPublished] = useState<DDO[]>([])
  const [downloaded, setDownloaded] = useState<DDO[]>([])
  const { bookmarks, setBookmarks, getCurrentUserSubscription } = useContext(User)
  const { sdk } = Catalog.useNevermined()
  const { walletAddress, getProvider} = MetaMask.useWallet()
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

    let downloaded = await loadUserDownloads(sdk, walletAddress)
    downloaded = downloaded.map((asset: any) => asset._did)
    // removing duplicates
    downloaded = [...new Set(downloaded)];
    const downloadedDDO = await Promise.all(
      downloaded.map(async (did: any) => await sdk.assets.resolve(did))
    )

    let subscriptionsEvents = await getUserSubscription(sdk, getProvider(), walletAddress, getCurrentUserSubscription()?.did)
    subscriptionsEvents = subscriptionsEvents.sort(
      (event1:any, event2:any) => event2.date.getTime() - event1.date.getTime()
    )
    const lastSuscriptionPurchase: Date = subscriptionsEvents?subscriptionsEvents[0]?.date:undefined
    setPurchaseDate(lastSuscriptionPurchase)
    setBookmarks(bookmarksDDO)
    setPublished(publishedDDO)
    setDownloaded(downloadedDDO)
  }

  useEffect(() => {
    if (!sdk?.profiles) {
      return
    }
    loadUserInfo()
  }, [sdk, walletAddress])

  const publishAsset = () => {
    if (!getCurrentUserSubscription()) {
      toast.error(subscriptionErrorText)
      return
    }
    Router.push('/user-publish')
  }

  const renderContent = () => {
    if (view == 0) {
      return <Summary
        published={published}
        bookmarks={bookmarks}
        downloaded={downloaded}
        currentSubscription={getCurrentUserSubscription()?.tier || ''}
      />
    } else if (view == 1) {
      return <UserProfile />
    } else if (view == 2) {
      return <AssetsList assets={bookmarks} />
    } else if (view == 3) {
      return (
        <>
          <UiButton onClick={() => publishAsset()}>Publish new asset</UiButton>
          <AssetsList assets={published} disableBatchSelect={true} />
        </>
      )
    } else if (view == 4) {
      return <AssetsList assets={downloaded} disableBatchSelect={true} />
    } else if (view == 5) {
      return (
        <>
        <Subscriptions purchaseDate={purchaseDate} currentSubscription={getCurrentUserSubscription()}/>
        </>
      )
    }
  }

  return (
    <>
      <UiLayout type="container">
        <div className={b('header')}>
          <div className={b('user-name')}>
            Welcome back
          </div>
          <div className={b('account-title')}>
            <UiText block type="h2" className={b('text')}>
              Your account
            </UiText>
          </div>
        </div>
        <div className={b('row')}>
          <div className={b('columnleft')}>
            <UiText
              className={b('pointer', view === 0 ? ['active'] : [])}
              type="link-caps"
              variants={['detail']}
              onClick={() => setView(0)}
            >
              Dashboard
            </UiText>
            <UiDivider />
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
