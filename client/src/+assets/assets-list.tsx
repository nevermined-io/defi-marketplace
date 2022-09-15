import React, { useRef, Fragment, useContext, useEffect, useState } from 'react'
import { DDO, Profile } from '@nevermined-io/nevermined-sdk-js'
import Link from 'next/link'

import {
  BEM,
  UiLayout,
  UiText,
  UiDivider,
  UiIcon,
  UiPopupHandlers,
  NotificationPopup
} from '@nevermined-io/styles'
import { XuiTokenName, XuiTokenPrice } from 'ui'
import { toDate, getDefiInfo, getDdoTokenAddress, getDdoSubscription, DDOSubscription} from '../shared'
import styles from './assets-list.module.scss'
import { User } from '../context'
import { Catalog } from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import {XuiDownloadAsset} from '../components/+download-asset/download-asset'

interface AssetsListProps {
  assets: DDO[]
  disableBatchSelect?: boolean
}

const b = BEM('assets-list', styles)
export function AssetsList({ assets, disableBatchSelect }: AssetsListProps) {
  const {
    selectedNetworks,
    selectedCategories,
    setSelectedNetworks,
    setSelectedCategories,
    bookmarks,
    setBookmarks,
    userSubscriptions
  } = useContext(User)
  const { walletAddress } = MetaMask.useWallet()
  const { sdk, account } = Catalog.useNevermined()
  const [userProfile, setUserProfile] = useState<Profile>({} as Profile)
  const [errorMessage, setErrorMessage] = useState('')
  const [batchActive, setBatchActive] = useState<boolean>(false)
  const [batchSelected, setBatchSelected] = useState<string[]>([])
  const [assetDid, setAssetDid] = useState<string>("")
  const popupRef = useRef<UiPopupHandlers>()
  const downloadPopupRef = useRef<UiPopupHandlers>()

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  const addToBatchSelected = (dids: string[]) => {
    setBatchSelected(batchSelected.concat(...dids.filter((did) => !batchSelected.includes(did))))
  }

  const checkAuth = async () => {
    
    let auth = true;
    if (!account.isTokenValid()) {
      auth = false
      setErrorMessage(
        'Your login is expired. Please first sign with your wallet and after try again'
      )
      popupRef.current?.open()
      await account.generateToken() 
      return auth
    }

    return auth
  }

  const onAddBookmark = async (did: string, description: string) => {
    try {
      const wasAuth = await checkAuth()
      if(!wasAuth) return
      const bookmark = await sdk.bookmarks.create({
        did,
        userId: userProfile.userId,
        description
      })

      const bookmarkDDO = await sdk.assets.resolve(bookmark.did)

      setBookmarks([...bookmarks, bookmarkDDO])
    } catch (error: any) {
      console.error(error.message)
      setErrorMessage('Error in adding bookmark')
      popupRef.current?.open()
    }
  }

  const onRemoveBookmark = async (did: string) => {
    try {
      const bookmarkDDO = bookmarks.find((item) => item.id === did)

      if (bookmarkDDO?.userId) {
        const bookmarksData = await sdk.bookmarks.findManyByUserId(bookmarkDDO?.userId)

        const bookmark = bookmarksData.results.find((b) => b.did === did)

        if (bookmark?.id) {
          const wasAuth = await checkAuth()
          if(!wasAuth) return wasAuth
          await sdk.bookmarks.deleteOneById(bookmark.id)
          setBookmarks(bookmarks.filter((item) => item.id !== bookmarkDDO.id))
        }
      }
    } catch (error: any) {
      console.error(error.message)
      setErrorMessage('Error in removing bookmark')
      popupRef.current?.open()
    }
  }

  const removeFromBatchSelected = (dids: string[]) => {
    const didsSet = new Set(dids)
    setBatchSelected(batchSelected.filter((did) => !didsSet.has(did)))
  }

  const checkAssetInUserSubscription = (subscription:DDOSubscription) => {
    const subs = userSubscriptions.find(s => s.tier === subscription.tier.toString() && s.address === subscription.address)
    if (subs?.access){
      return true
    }
    return false
  }

  type AssetInfo = {did:string, subscription:DDOSubscription}

  const downloadAsset = async(assetInfo: AssetInfo) => {

    if (!checkAssetInUserSubscription(assetInfo.subscription)){
      setErrorMessage("You can't download this Asset with your current subscription")    
      popupRef.current?.open()
      return
    }
    setAssetDid(assetInfo.did)

    downloadPopupRef.current?.open()
  }

  useEffect(() => {
    if (!sdk?.profiles) {
      return
    }
  
    (async () => {

      if (!walletAddress)
        return

      const userProfile = await sdk.profiles.findOneByAddress(walletAddress)
      if (!userProfile?.userId) {
        return
      }

      const bookmarksData = await sdk.bookmarks.findManyByUserId(userProfile.userId)

      const bookmarksDDO = await Promise.all(
        bookmarksData.results?.map((bookmark) => sdk.assets.resolve(bookmark.did))
      )

      setBookmarks([...bookmarksDDO])
      setUserProfile(userProfile)
    })()
  }, [sdk])

  return (
    <div className={b()}>

      <XuiDownloadAsset popupRef={downloadPopupRef} assetDid={assetDid}/>
      <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />

      {disableBatchSelect ? (
        <></>
      ) : (
        <div className={b('heading')}>
          <div className={b('batch-select-wrapper')}>
            {batchActive ? (
              <Fragment>
                <div className={b('batch-select')}>
                  {assets.every((asset) => batchSelected.includes(asset.id)) ? (
                    <img
                      alt="checkbox"
                      onClick={() => removeFromBatchSelected(assets.map((asset) => asset.id))}
                      className={b('batch-checkbox')}
                      src={'assets/checked_box.svg'}
                      width="14px"
                    />
                  ) : (
                    <img
                      alt="uncheckbox"
                      onClick={() => addToBatchSelected(assets.map((asset) => asset.id))}
                      className={b('batch-checkbox')}
                      src={'assets/unchecked_box.svg'}
                      width="14px"
                    />
                  )}
                  <div className={b('selected-count')}>
                    Selected: <b>{batchSelected.length}</b>
                  </div>
                  <img
                    alt="close"
                    className={b('batch-close')}
                    onClick={() => setBatchActive(false)}
                    src={'assets/close.svg'}
                    width="12px"
                  />
                </div>
                <div
                  className={b('basket-add')}
                  onClick={(e) => {
                    openPopup(e)
                    //TODO How to handle batch selection?
                  }}
                >
                  Add to basket
                </div>
              </Fragment>
            ) : null 
                /* (
                  TODO - How to handle multiple selection
              <div className={b('batch-select-inactive')} onClick={() => setBatchActive(true)}>
                Batch Select
              </div>
              )*/     
            }
          </div>
        </div>
      )}
      <UiLayout className={b('asset', ['asset-row-header'])}>
        <UiText type="caps" className={b('asset', ['indexer'])} variants={['detail']}>
          indexer
        </UiText>
        <UiText type="caps" className={b('info', ['info-header'])} variants={['detail']}>
          category
        </UiText>
        <UiText type="caps" className={b('info', ['info-header'])} variants={['detail']}>
          network
        </UiText>
        <UiText type="caps" className={b('info', ['price'])} variants={['detail']}>
          price
        </UiText>
      </UiLayout>
      <UiDivider />
      {assets
        .map((asset) => ({ asset, metadata: asset.findServiceByType('metadata').attributes }))
        .map((data) => ({ ...data, defi: getDefiInfo(data.metadata), subscription: getDdoSubscription(data.asset) }))
        .map(({ asset, metadata, defi, subscription }, i) => (
          <UiLayout key={`asset-${asset.id}-${i}`} className={b('asset')}>
            <div className={b(`${batchActive ? 'checkbox' : 'checkbox--hidden'}`)}>
              {batchSelected.includes(asset.id) ? (
                <img
                  onClick={() => removeFromBatchSelected([asset.id])}
                  src={'assets/checked_box.svg'}
                  width="20px"
                />
              ) : (
                <img
                  onClick={() => addToBatchSelected([asset.id])}
                  src={'assets/unchecked_box.svg'}
                  width="20px"
                />
              )}
            </div>
            <div className={`${b('asset-title')}`}>
              <Link href={`/asset/${asset.id}`}>
                <UiText className={`pointer`} wrapper="h4" type="h4">
                  {metadata.main.name} - {subscription.tier?.toString()}
                </UiText>
              </Link>
              <UiText className={b('asset-date')} type="small" variants={['detail']}>
                {toDate(metadata.main.datePublished as string).replace(/\//g, '.')}
              </UiText>
            </div>
            {defi?.category && defi?.network && (
              <>
                <UiLayout
                  className={b('info')}
                  onClick={() =>
                    setSelectedCategories(
                      !selectedCategories.includes(defi.category)
                        ? selectedCategories.concat(defi.subcategory)
                        : selectedCategories
                    )
                  }
                >
                  <UiIcon className={b('info-icon')} icon="folder" color="secondary" />
                  <UiText variants={['secondary']}>{defi.category}</UiText>
                  <UiText variants={['detail']}>&nbsp;&ndash;&nbsp;</UiText>
                  <UiText variants={['secondary']}>{defi.subcategory}</UiText>
                </UiLayout>
                <UiLayout
                  className={b('info')}
                  onClick={() =>
                    setSelectedNetworks(
                      !selectedNetworks.includes(defi.network)
                        ? selectedNetworks.concat(defi.network)
                        : selectedNetworks
                    )
                  }
                >
                  {defi.network.toLowerCase() == 'none' || defi.network.toLowerCase() == 'na' ? (
                    <></>
                  ) : (
                    <img
                      alt="network"
                      src={`/assets/logos/${defi.network.toLowerCase()}.svg`}
                      style={{ cursor: 'pointer', paddingRight: '10px' }}
                      width="25"
                    />
                  )}

                  <UiText variants={['secondary']}>{defi.network}</UiText>
                </UiLayout>
              </>
            )}
            <UiLayout className={b('info', ['price'])}>
              <UiIcon className={b('info-icon')} icon="tag" color="secondary" />
              <UiText variants={['secondary']}>
                <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice>{' '}
                <UiText variants={['detail']}>
                  <XuiTokenName address={getDdoTokenAddress(asset)?.toString()} />
                </UiText>
              </UiText>
            </UiLayout>
            {bookmarks.some((bookmark) => bookmark.id === asset.id) ? (
              <UiLayout className={b('bookmark')} onClick={() => onRemoveBookmark(asset.id)}>
                <img
                  className={b('bookmark', ['cover'])}
                  alt="network"
                  src={'/assets/bookmark-marked.svg'}
                  style={{ cursor: 'pointer' }}
                  width="25"
                />
                <div className={b('bookmark', ['minus'])}>-</div>
              </UiLayout>
            ) : (
              <UiLayout className={b('bookmark')} onClick={() => onAddBookmark(asset.id, '')}>
                <img
                  className={b('bookmark', ['cover'])}
                  alt="network"
                  src={'/assets/bookmark.svg'}
                  style={{ cursor: 'pointer' }}
                  width="25"
                />
                <div className={b('bookmark', ['plus'])}>+</div>
              </UiLayout>
            )}
            <hr style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
            
              <img
                alt="download"
                onClick={() => {
                  downloadAsset({did: asset.id, subscription: subscription})
                }}
                width="24px"
                src="assets/download_icon.svg"
                style={{ cursor: 'pointer' }}
              />
           
          </UiLayout>
        ))}
    </div>
  )
}
