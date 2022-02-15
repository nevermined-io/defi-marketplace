import React, { useEffect, useContext, useState, useCallback } from 'react'
import type { NextPage } from 'next'
import Image from "next/image"

import { User } from '../context'
import styles from './profile.module.scss'
import { BEM, UiText, UiLayout, UiIcon, UiDivider, XuiBuyAsset } from 'ui'
import { getAllUserBundlers, Bundle } from 'src/shared'
import { XuiPagination } from 'ui/+assets-query/pagination'
import { mockAssetArray } from '../utils/mock-bundles'
enum assetStatus {
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING"
}
const BUNDLES_PER_PAGE = 5
const b = BEM('profile', styles)
export const Profile: NextPage = () => {
  const { sdk, account } = useContext(User)

  const [assets, setAssets] = useState<Bundle[]>([])

  // const [all, setAll] = useState<boolean>(false) TBI
  const [completed, setCompleted] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  // const [sold, setSold] = useState<boolean>(false) TBI
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)


  useEffect(() => {
    if (!sdk.accounts) {
      return
    }
    loadBundles()
      .then((assets: any[]) => {
        setAssets(assets)
        calculatePages(assets)
      })
  }, [sdk.accounts])

  const loadBundles = async () => {
    const account = (await sdk.accounts.list())[0]
    const userBundles = account ? await getAllUserBundlers(account.getId()) : []
    return userBundles
    // return mockAssetArray
  }

  const calculateStartEndPage = useCallback(() => {
    const start = (page - 1) * BUNDLES_PER_PAGE
    const end = (page) * BUNDLES_PER_PAGE
    return { start, end }
  }, [page])


  const calculatePages = (assets: any[]) => {
    const totPages = Math.ceil(assets.length / BUNDLES_PER_PAGE)
    setTotalPages(totPages)
  }

  const checkCompleted = () => {
    let assetArray = []
    if (!completed) {
      setCompleted(true)
      assetArray = assets.filter((asset: any) => asset.status === assetStatus.COMPLETED)
    } else {
      setCompleted(false)
      assetArray = assets
    }
    calculatePages(assetArray)
    setPage(1)
  }

  const checkProcessing = () => {
    let assetArray = []
    if (!processing) {
      setProcessing(true)
      assetArray = assets.filter((asset: any) => asset.status === assetStatus.PROCESSING)
    } else {
      setProcessing(false)
      assetArray = assets
    }
    calculatePages(assetArray)
    setPage(1)
  }



  return (
    assets.length > 0 ?
      <>
        <UiLayout type="container">

          <UiLayout type="container">
            <UiText wrapper="h1" type="h1" variants={['heading']}>Profile</UiText>
            <UiText type="h2" wrapper="h2"> {`${account.substr(0, 6)}...${account.substr(-4)}`}</UiText>
          </UiLayout>
          <UiDivider type="l" />

          <UiLayout type="container" className={b("button-container")}>
            <div className={b("all-button-container")}>
              {/* <div className={all ? b("all-button", ['selected']) :  b("all-button") }
            onClick={() => all ? setAll(false) : setAll(true)}
            >
              all
            </div> */}
              <div className={b("button-container-second")}>
                <div className={completed ? b("other-button", ['selected']) : b("other-button")}
                  onClick={checkCompleted}
                >
                  Completed
                </div>
                <div className={processing ? b("other-button", ['selected']) : b("other-button")}
                  onClick={checkProcessing}
                >
                  Processing
                </div>
                {
                  (completed || processing) &&
                  <div onClick={() => { setCompleted(false); setProcessing(false); calculatePages(assets) }} className={b('clear-div')} >
                    <span className={b('clear-div', ['clear-button'])} >
                      Clear
                    </span>
                    <span className={b('clear-div')} >
                      <Image width="10" height="10" src="/assets/blue-cross.svg" />
                    </span>
                  </div>

                }
              </div>
            </div>
            {
              assets.find((item: any) => item.status === assetStatus.PROCESSING) &&
              <span className={b("loadspinner")} >
                <UiText type="small" wrapper="small" variants={['highlight']} className={b("loadspinner", ["text"])}>Checkout packaging in progress...</UiText>
                <Image width="50" height="50" src="/assets/profile-loadspinner.svg" className={b("loadspinner", ["spinner"])} />
              </span>
            }
          </UiLayout>

          <UiDivider />

          <UiLayout type="container">
            <UiLayout className={b('asset', ['header-asset-row'])}>
              <UiText type="caps" className={b('asset-header', ['bundle-header'])} variants={['detail']}>
                Bundle
              </UiText>
              <UiText type="caps" className={b('asset-header')} variants={['detail']}>
                Creation Date
              </UiText>
              <UiText type="caps" className={b('asset-header')} variants={['detail']}>
                N. of datasets
              </UiText>
              <UiText type="caps" className={b('asset-header')} variants={['detail']}>
                Status
              </UiText>
            </UiLayout>
            <UiDivider />

            {
              assets
                .filter((asset: any) => completed ? asset.status === assetStatus.COMPLETED : true)
                .filter((asset: any) => processing ? asset.status === assetStatus.PROCESSING : true)
                .slice(calculateStartEndPage().start, calculateStartEndPage().end)
                .map((asset: Bundle, index: number) => (
                  <UiLayout key={asset.did} className={b('asset')}>
                    <UiText className={b('asset-date')} type="p" variants={['highlight']}>
                      {asset.bundleId}
                    </UiText>
                    <UiDivider flex />
                    <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                      {new Date(asset.createdAt).toDateString()}
                    </UiText>
                    <UiDivider flex />
                    <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                      {asset.datasets.length}
                    </UiText>
                    <UiDivider flex />
                    <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                      {asset.status}
                    </UiText>
                    <UiDivider flex />
                    {/* <UiDivider flex /> */}
                    <hr size="40" style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
                    <XuiBuyAsset asset={asset.did}>
                      <img width="24px" src="assets/basket_icon.svg" style={{ cursor: 'pointer' }} />
                    </XuiBuyAsset>
                  </UiLayout>
                ))}
            {
              totalPages > 1 &&
              <XuiPagination totalPages={totalPages} page={page} setPage={setPage} />
            }
          </UiLayout>
        </UiLayout>
      </>:
      <UiLayout type="container">

        <UiLayout type="container">
          <UiText wrapper="h1" type="h1" variants={['heading']}>Profile</UiText>
          <UiText type="h2" wrapper="h2"> {account ? `${account.substr(0, 6)}...${account.substr(-4)}`: ""}</UiText>
        </UiLayout>
        <UiDivider type="l" />
        <UiLayout className={b('asset', ['header-asset-row'])}>
          <UiText style={{ justifyContent: "center"}} type="p" variants={['secondary']}>
            NO ORDERS YET
          </UiText>
        </UiLayout>
      </UiLayout>
  )
}
