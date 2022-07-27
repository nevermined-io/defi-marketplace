import React, { useRef, Fragment, useContext, useEffect, useState } from 'react'
import { DDO, Profile } from '@nevermined-io/nevermined-sdk-js'
import Link from "next/link"

import {
  BEM,
  UiLayout,
  UiText,
  UiDivider,
  UiIcon,
  UiPopupHandlers,
  NotificationPopup,
} from '@nevermined-io/styles'
import { XuiTokenName, XuiTokenPrice } from 'ui'
import { toDate, getDefiInfo, getDdoTokenAddress } from '../shared'
import styles from './assets-list.module.scss'
import { User } from '../context'
import { AddedToBasketPopup } from './added-to-basket-popup'
import Catalog from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'

interface AssetsListProps {
  assets: DDO[],
  disableBatchSelect?: boolean
}

const b = BEM('assets-list', styles)
export function AssetsList({ assets, disableBatchSelect }: AssetsListProps) {
  const { selectedNetworks, selectedCategories, addToBasket, setSelectedNetworks, setSelectedCategories, userBundles, bookmarks, setBookmarks } = useContext(User)
  const { walletAddress } = MetaMask.useWallet()
  const { sdk, account } = Catalog.useNevermined()
  const [userProfile, setUserProfile] = useState<Profile>({} as Profile)
  const [errorMessage, setErrorMessage] = useState('')
  const [batchActive, setBatchActive] = useState<boolean>(false)
  const [batchSelected, setBatchSelected] = useState<string[]>([])
  const popupRef = useRef<UiPopupHandlers>()

  const openPopup = (event: any) => {
    popupRef.current?.open()
    event.preventDefault()
  }

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  const addToBatchSelected = (dids: string[]) => {
    setBatchSelected(batchSelected.concat(...dids.filter(did => !batchSelected.includes(did))))
  }

  const checkAuth = async () => {
    if (!account.isTokenValid()) {
      setErrorMessage('Your login is expired. Please first sign with your wallet and after try again')
      popupRef.current?.open()
      await account.generateToken()
    }
  }

  const onAddBookmark = async (did: string, description: string) => {
    try {
      await checkAuth()
      const bookmark = await sdk.bookmarks.create({
        did,
        userId: userProfile.userId,
        description,
      });

      const bookmarkDDO = await sdk.assets.resolve(bookmark.did);

      setBookmarks([...bookmarks, bookmarkDDO])
    } catch (error: any) {
      console.error(error.message)
      setErrorMessage("Error in adding bookmark")
      popupRef.current?.open()
    }
  }

  const onRemoveBookmark = async (did: string) => {
    try {
      

      const bookmarkDDO = bookmarks.find(item => item.id === did);

      console.log(bookmarkDDO)

      if (bookmarkDDO?.userId) {
        const bookmarksData = await sdk.bookmarks.findManyByUserId(bookmarkDDO?.userId)

        const bookmark = bookmarksData.results.find(b => b.did === did);

        if (bookmark?.id) {
          await checkAuth()
          await sdk.bookmarks.deleteOneById(bookmark.id);
          setBookmarks(bookmarks.filter(item => item.id !== bookmarkDDO.id))
        } 
      }

    } catch (error: any) {
      console.error(error.message)
      setErrorMessage("Error in removing bookmark")
      popupRef.current?.open()
    }
  }


  const removeFromBatchSelected = (dids: string[]) => {
    const didsSet = new Set(dids)
    setBatchSelected(batchSelected.filter(did => !didsSet.has(did)))
  }

  useEffect(() => {
    if (!sdk?.profiles) {
      return
    }

    (async () => {
      const userProfile = await sdk.profiles.findOneByAddress(walletAddress)
      if (!userProfile?.userId) {
        return
      }

      const bookmarksData = await sdk.bookmarks.findManyByUserId(userProfile.userId)

      const bookmarksDDO = await Promise.all(
        bookmarksData.results?.map(bookmark => sdk.assets.resolve(bookmark.did))
      )

      setBookmarks([...bookmarksDDO])
      setUserProfile(userProfile)
    })()
  }, [sdk])

  return (
    <div className={b()}>
      <AddedToBasketPopup closePopup={closePopup} popupRef={popupRef} />
      <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />

      {disableBatchSelect
        ?
        <></>
        :
        <div className={b('heading')}>
          <div className={b('batch-select-wrapper')}>
            {batchActive ?
              <Fragment>
                <div className={b('batch-select')}>
                  {assets.every(asset => batchSelected.includes(asset.id)) ?
                    <img alt='checkbox' onClick={() => removeFromBatchSelected(assets.map(asset => asset.id))} className={b('batch-checkbox')} src={'assets/checked_box.svg'} width="14px" /> :
                    <img alt='uncheckbox' onClick={() => addToBatchSelected(assets.map(asset => asset.id))} className={b('batch-checkbox')} src={'assets/unchecked_box.svg'} width="14px" />
                  }
                  <div className={b('selected-count')}>Selected: <b>{batchSelected.length}</b></div>
                  <img
                    alt='close'
                    className={b('batch-close')}
                    onClick={() => setBatchActive(false)}
                    src={'assets/close.svg'}
                    width="12px"
                  />
                </div>
                <div className={b('basket-add')} onClick={(e) => {
                  openPopup(e)
                  addToBasket(batchSelected)
                }}>Add to basket</div>
              </Fragment> :
              <div className={b('batch-select-inactive')} onClick={() => setBatchActive(true)}>Batch Select</div>
            }
          </div>

        </div>
      }
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
        .map(asset => ({ asset, metadata: asset.findServiceByType('metadata').attributes }))
        .map(data => ({ ...data, defi: getDefiInfo(data.metadata) }))
        .map(({ asset, metadata, defi }) => (
          <UiLayout key={asset.id} className={b('asset')}>
            <div className={b(`${batchActive ? 'checkbox' : 'checkbox--hidden'}`)}>
              {batchSelected.includes(asset.id) ?
                <img onClick={() => removeFromBatchSelected([asset.id])} src={'assets/checked_box.svg'} width="20px" /> :
                <img onClick={() => addToBatchSelected([asset.id])} src={'assets/unchecked_box.svg'} width="20px" />
              }
            </div>
            <div className={`${b('asset-title')}`}>
              <Link href={`/asset/${asset.id}`}>
                <UiText className={`pointer`} wrapper="h4" type="h4"
                >{metadata.main.name}</UiText>
              </Link>
              <UiText className={b('asset-date')} type="small" variants={['detail']}>
                {toDate(metadata.main.datePublished as string).replace(/\//g, '.')}
              </UiText>

            </div>
            {defi?.category && defi?.network && (
              <>
                <UiLayout className={b('info')}
                  onClick={() => setSelectedCategories(!selectedCategories.includes(defi.category) ? selectedCategories.concat(defi.subcategory) : selectedCategories)}

                >
                  <UiIcon className={b('info-icon')} icon="folder" color="secondary" />
                  <UiText variants={['secondary']}>{defi.category}</UiText>
                  <UiText variants={['detail']}>&nbsp;&ndash;&nbsp;</UiText>
                  <UiText variants={['secondary']}>{defi.subcategory}</UiText>
                </UiLayout>
                <UiLayout className={b('info')}
                  onClick={() => setSelectedNetworks(!selectedNetworks.includes(defi.network) ? selectedNetworks.concat(defi.network) : selectedNetworks)}
                >
                  {defi.network.toLowerCase() == 'none' || defi.network.toLowerCase() == 'na'
                    ?
                    <></>
                    :
                    <img
                      alt='network'
                      src={`/assets/logos/${defi.network.toLowerCase()}.svg`}
                      style={{ cursor: 'pointer', paddingRight: "10px" }}
                      width="25"
                    />
                  }

                  <UiText variants={['secondary']}>{defi.network}</UiText>
                </UiLayout>
              </>
            )}
            <UiLayout className={b('info', ['price'])}>
              <UiIcon className={b('info-icon')} icon="tag" color="secondary" />
              <UiText variants={['secondary']}>
                <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice>
                {' '}
                <UiText variants={['detail']}>
                  <XuiTokenName address={getDdoTokenAddress(asset)?.toString()} />
                </UiText>
              </UiText>
            </UiLayout>
            {bookmarks.some(bookmark => bookmark.id === asset.id) ?
              <UiLayout className={b('bookmark')} onClick={() => onRemoveBookmark(asset.id)}>
                <img
                  className={b('bookmark', ['cover'])}
                  alt='network'
                  src={'/assets/bookmark-marked.svg'}
                  style={{ cursor: 'pointer' }}
                  width="25"
                />
                <div className={b('bookmark', ['minus'])}>-</div>
              </UiLayout>
              :
              <UiLayout className={b('bookmark')} onClick={() => onAddBookmark(asset.id, '')}>
                <img
                  className={b('bookmark', ['cover'])}
                  alt='network'
                  src={'/assets/bookmark.svg'}
                  style={{ cursor: 'pointer' }}
                  width="25"
                />
                <div className={b('bookmark', ['plus'])}>+</div>
              </UiLayout>
            }
            <hr style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
            {userBundles.some(bundle => bundle.datasets.some(dataset => dataset.datasetId === asset.id)) ?
              <img alt='download' width="24px" src="assets/added_to_basket.svg" />
              :
              <img
                alt='basket'
                onClick={(e) => {
                  openPopup(e)
                  addToBasket([asset.id])
                }} width="24px" src="assets/basket_icon.svg" style={{ cursor: 'pointer' }} />
            }
          </UiLayout>
        ))
      }

    </div>
  )
}
