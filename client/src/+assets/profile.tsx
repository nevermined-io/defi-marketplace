import React, { useEffect, useContext, useState, useCallback, useRef } from 'react'
import type { NextPage } from 'next'
import Image from "next/image"
import Catalog from '@nevermined-io/components-catalog'
import { User } from '../context'
import styles from './profile.module.scss'
import { XuiAssetsQuery } from 'ui'
import { BEM, UiText, UiLayout, UiDivider, UiButton, UiIcon, UiPopupHandlers } from '@nevermined-io/styles'
import { XuiBuyAsset } from 'ui'
import { Bundle, calculatePages, calculateStartEndPage } from 'src/shared'
import { XuiPagination } from 'ui/+assets-query/pagination'
import { Account, Bookmark } from '@nevermined-io/nevermined-sdk-js'
import { didZeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'
import { entitesNames } from 'src/config'
import { loadFullfilledEvents } from 'src/shared/graphql'
import { DownloadPopup } from 'ui/+download-asset/popup/download-asset-popup'
import { AssetsList } from './assets-list'

enum AssetStatus {
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING",
  PENDING = "PENDING"
}

interface ExtendedBundle extends Bundle {
  purchased: boolean
}

const BUNDLES_PER_PAGE = 5
const b = BEM('profile', styles)
export const Profile: NextPage = () => {
  const { userBundles } = useContext(User)
  const { walletAddress } = Catalog.useWallet()
  const { sdk } = Catalog.useNevermined()
  const [assets, setAssets] = useState<ExtendedBundle[]>([])

  // const [all, setAll] = useState<boolean>(false) TBI
  const [completed, setCompleted] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [bookmarkFilter, setBookmarkFiler] = useState<boolean>(false)
  // const [sold, setSold] = useState<boolean>(false) TBI
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [showBundleDetail, setShowBundleDetail] = useState<boolean[]>(assets.map(asset => !asset))
  const [userAccount, setUserAccount] = useState<Account>()
  const popupRef = useRef<UiPopupHandlers>()
  const renderAssets = useCallback(assets => (<AssetsList assets={assets}/>), [])

  useEffect(() => {
    if (!sdk.accounts || !userBundles.length) {
      return
    }
    sdk.accounts.list().then((accounts) => {
      if (accounts.length > 0) {
        setUserAccount(accounts[0])
        loadBundles(accounts[0])
          .then((assets: any[]) => {
            setAssets(assets.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            )
            setTotalPages(calculatePages(assets.length, BUNDLES_PER_PAGE))
          })
      }
    })
  }, [sdk.accounts, userBundles])


  const loadBundles = async (account: Account) => {
    const purchasedBundles = await loadFullfilledEvents(account.getId())
    const userBundlesPurchased: ExtendedBundle[] = userBundles.map(bundle => {
      return {
        ...bundle,
        purchased: purchasedBundles.filter(
          purchased => purchased.documentId == didZeroX(bundle.did)
        ).length > 0 ? true : false,
      }
    })

    return userBundlesPurchased
  }

  const startEndPage = useCallback(() => {
    return calculateStartEndPage(page, BUNDLES_PER_PAGE)
  }, [page])

  const checkBookmarkFilter = () => {
    let assetArray = []
    if (!bookmarkFilter) {
      setBookmarkFiler(true)
      if (processing) setProcessing(false)
      if (completed) setCompleted(false)
      assetArray = assets.filter((asset: any) => asset.status === AssetStatus.COMPLETED)
    } else {
      setBookmarkFiler(false)
      assetArray = assets
    }
    setTotalPages(calculatePages(assetArray.length, BUNDLES_PER_PAGE))
    setPage(1)
  }

  const checkCompleted = () => {
    let assetArray = []
    if (!completed) {
      setCompleted(true)
      if (processing) setProcessing(false)
      if (bookmarkFilter) setBookmarkFiler(false)
      assetArray = assets.filter((asset: any) => asset.status === AssetStatus.COMPLETED)
    } else {
      setCompleted(false)
      assetArray = assets
    }
    setTotalPages(calculatePages(assetArray.length, BUNDLES_PER_PAGE))
    setPage(1)
  }

  const checkProcessing = () => {
    let assetArray = []
    if (!processing) {
      setProcessing(true)
      if (completed) setCompleted(false)
      if (bookmarkFilter) setBookmarkFiler(false)
      assetArray = assets.filter((asset: any) => asset.status === AssetStatus.PROCESSING)
    } else {
      setProcessing(false)
      assetArray = assets
    }
    setTotalPages(calculatePages(assetArray.length, BUNDLES_PER_PAGE))
    setPage(1)
  }

  const downloadAsset = (did: any) => {
    if (userAccount) {
      sdk.assets.download(
        did,
        userAccount
      )
    }
  }

  const onOpenBundleDetails = async (index: number) => {
    showBundleDetail[index] = !showBundleDetail[index]
    setShowBundleDetail([...showBundleDetail])
  }

  const setFormat = (filename: string) => {
    const parts = filename.replace('_', '-').split('-')

    if (parts.length > 2) {
      let date = parts[4]
        .slice(0, 8)
        .split('')

      date.splice(4, 0, ':')
      date.splice(7, 0, ':')

      return (
        <>
          <span className={b('asset-detail')}>Protocol:</span><span className={b('asset-detail-value')}> {parts[0]}</span>
          <span className={b('asset-detail')}>Version:</span> <span className={b('asset-detail-value')}> {parts[1]}</span>
          <span className={b('asset-detail')}>Entity:</span> <span className={b('asset-detail-value')}> {entitesNames[parts[2]]}</span>
          <span className={b('asset-detail')}>Blockchain:</span> <span className={b('asset-detail-value')}> {parts[3].toUpperCase()}</span>
         <span className={b('asset-detail')}>Date:</span> <span className={b('asset-detail-value')}>
            {date.join('')}
          </span>
        </>
      )
      } 

      return (
          <>
            <span className={b('asset-detail')}>File:</span><span className={b('asset-detail-value')}> {filename}</span> 
          </>
      )
      
  }

  const closeDownloadPopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  const openDownloadPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  return (
      <>
        <DownloadPopup closePopup={closeDownloadPopup} popupRef={popupRef} />
        <UiLayout type="container">

          <UiLayout type="container">
            <UiText wrapper="h1" type="h1" variants={['heading']}>Profile</UiText>
            <UiText type="h2" wrapper="h2"> {`${walletAddress.substr(0, 6)}...${walletAddress.substr(-4)}`}</UiText>
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
              <div className={bookmarkFilter ? b("other-button", ['selected']) : b("other-button")}
                  onClick={checkBookmarkFilter}
                >
                  Bookmark
                </div>
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
                  (completed || processing || bookmarkFilter) &&
                  <div onClick={() => { setCompleted(false); setProcessing(false); setBookmarkFiler(false); setTotalPages(calculatePages(assets.length, BUNDLES_PER_PAGE)) }} className={b('clear-div')} >
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
              (!bookmarkFilter &&
              assets.find((item: any) => item.status === AssetStatus.PROCESSING || item.status === AssetStatus.PENDING)) &&
              <span className={b("loadspinner")} >
                <UiText type="small" wrapper="small" variants={['highlight']} className={b("loadspinner", ["text"])}>Checkout packaging in progress...</UiText>
                <Image width="50" height="50" src="/assets/profile-loadspinner.svg" className={b("loadspinner", ["spinner"])} />
              </span>
            }
          </UiLayout>

          <UiDivider />
          { bookmarkFilter ?
            <UiLayout type="container">
                <XuiAssetsQuery content={renderAssets} onlyBookmark={true}/>
            </UiLayout>

            : assets.length ?

          <UiLayout type="container">
            <UiLayout className={b('asset', ['header-asset-row'])}>
              <UiText type="caps" className={b('asset-header', ['bundle-header'])} variants={['detail']}>
                Bundle
              </UiText>
              <UiText type="caps" className={b('asset-header', ['bundle-header-date'])} variants={['detail']}>
                Creation Date
              </UiText>
              <UiText type="caps" className={b('asset-header', ['bundle-header-dataset'])} variants={['detail']}>
                N. of datasets
              </UiText>
              <UiText type="caps" className={b('asset-header', ['bundle-header-status'])} variants={['detail']}>
                Status
              </UiText>
            </UiLayout>
            <UiDivider />

            {
              assets
                .filter((asset: any) => completed ? asset.status === AssetStatus.COMPLETED : true)
                .filter((asset: any) => processing ? (asset.status === AssetStatus.PROCESSING || asset.status === AssetStatus.PENDING) : true)
                .slice(startEndPage().start, startEndPage().end)
                .map((asset: ExtendedBundle, index: number) => (
                  <UiLayout className={b('asset')} direction={'row'} key={asset.did}>
                    <UiLayout className={b('asset-bundle')}>
                      <UiText className={b('asset-date')} type="p" variants={['highlight']}>
                        <UiButton className={b('asset-button')} type='alt' onClick={() => onOpenBundleDetails(index)}>
                          <Image width="10" height="10" alt='loading' className={b('asset-arrow', [showBundleDetail[index] ? 'shrink' : ''])} src="/assets/arrow.svg" />
                          <UiText className={b('asset-bundle-id')}>
                            {asset.bundleId}
                          </UiText>
                        </UiButton>
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
                      {asset.status === AssetStatus.PENDING || asset.status === AssetStatus.PROCESSING ?
                        <Image width='24' height='24' alt='loading' src="/assets/profile-loadspinner.svg" className={b("loadspinner", ["spinner"])} />
                        : asset.purchased ?
                          <div style={{ cursor: 'pointer' }}>
                            <Image width='24' height='24' alt='download' src="/assets/download_icon.svg" onClick={(e) => {
                              downloadAsset(asset.did)
                              openDownloadPopup(e)
                              }} />
                          </div>
                          :
                          <XuiBuyAsset asset={asset.did}>
                            <Image width='24' height='24' alt='basket' src="/assets/basket_icon.svg" style={{ cursor: 'pointer' }} />
                          </XuiBuyAsset>
                      }

                    </UiLayout>
                    {showBundleDetail[index] &&
                      asset.datasets.map(dataSet => (
                        <UiLayout className={b('asset-dataset')} justify='center' align='center' direction='column' type='container' key={dataSet.datasetId}>
                          <UiLayout className={b('asset-dataset-container')}>
                            <UiIcon className={b('asset-file')} icon="file" color="secondary" />
                            <UiLayout className={b('asset-detail-container')}>
                              <UiDivider vertical />
                              <UiText className={b('asset-date')} type="small" variants={['secondary']}>
                                {setFormat(dataSet.fileName)}
                              </UiText>
                            </UiLayout>
                          </UiLayout>
                        </UiLayout>
                      ))
                    }
                  </UiLayout>

                ))}
            {
              totalPages > 1 &&
              <XuiPagination totalPages={totalPages} page={page} setPage={setPage} />
            }
          </UiLayout> :
          <UiLayout type='container'>
            <UiText>NO ORDERS YET, HOWEVER YOU CAN STILL CLICK IN BOOKMARKS TO CHECK YOUR FAVORITE ASSETS</UiText>
          </UiLayout>
        }
        </UiLayout>
      </>
  )
}
