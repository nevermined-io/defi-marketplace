import React, { createRef, Fragment, useContext, useEffect, useState } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import Link from "next/link"
import Router from 'next/router'

import {
  BEM,
  UiLayout,
  UiText,
  UiDivider,
  UiIcon,
  XuiTokenName,
  XuiTokenPrice,
  UiPopupHandlers,
  UiPopup, UiButton
} from 'ui'
import { toDate, getDefiInfo, getDdoTokenAddress } from '../shared'
import styles from './assets-list.module.scss'
import { User } from '../context'

interface AssetsListProps {
  assets: DDO[]
}

const b = BEM('assets-list', styles)
export function AssetsList({ assets }: AssetsListProps) {
  const { basket, selectedNetworks, selectedCategories, addToBasket, setSelectedNetworks, setSelectedCategories } = useContext(User)
  const [batchActive, setBatchActive] = useState<boolean>(false)
  const [batchSelected, setBatchSelected] = useState<string[]>([])
  const popupRef = createRef<UiPopupHandlers>()

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


  const removeFromBatchSelected = (dids: string[]) => {
    const didsSet = new Set(dids)
    setBatchSelected(batchSelected.filter(did => !didsSet.has(did)))
  }

  return (
    <div className={b()}>
      <UiPopup ref={popupRef}>
        <div className={b('basket-popup')}>
          <img src="assets/check_mark.svg" width="73px" />
          <UiText style={{ color: '#2E405A', margin: '72px 0 25px' }} type="h3">Added to basket</UiText>
          <div className={b('popup-text')}>
            You can now view your basket contents from by clicking the navigation icon&nbsp;&nbsp;
            <img src="assets/basket_icon.svg" width="16px" />
          </div>
          <div className={b('popup-buttons')}>
            <UiButton cover style={{ padding: '0', width: '170px' }} onClick={closePopup}>Back To Search</UiButton>
            <UiButton cover style={{ padding: '0', width: '170px' }} type="alt " onClick={() => Router.push('/checkout')}>Go To Basket</UiButton>
          </div>
        </div>
      </UiPopup>

      <div className={b('heading')}>
        <div className={b('batch-select-wrapper')}>
          {batchActive ?
            <Fragment>
              <div className={b('batch-select')}>
                {assets.every(asset => batchSelected.includes(asset.id)) ?
                  <img onClick={() => removeFromBatchSelected(assets.map(asset => asset.id))} className={b('batch-checkbox')} src={'assets/checked_box.svg'} width="14px" /> :
                  <img onClick={() => addToBatchSelected(assets.map(asset => asset.id))} className={b('batch-checkbox')} src={'assets/unchecked_box.svg'} width="14px" />
                }
                <div className={b('selected-count')}>Selected: <b>{batchSelected.length}</b></div>
                <img
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
      {/* <UiLayout type="container"> */}
      <UiLayout className={b('asset', ['asset-row-header'])}>
        <UiText type="caps" className={b('asset', ['indexer'])} variants={['detail']}>
          indexer
        </UiText>
        {/* <UiText type="caps" className={b('asset-header')} variants={['detail']}>
            protocol
            </UiText> */}
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
      {/* </UiLayout> */}
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
                {toDate(metadata.main.dateCreated).replace(/\//g, '.')}
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
                  <img
                    src={`/assets/logos/${defi.network.toLowerCase()}.svg`}
                    style={{ cursor: 'pointer', paddingRight: "10px" }}
                    width="25"
                  />
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
                  <XuiTokenName address={getDdoTokenAddress(asset)} />
                </UiText>
              </UiText>
            </UiLayout>
            <hr size="40" style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
            <img onClick={(e) => {
              openPopup(e)
              addToBasket([asset.id])
            }} width="24px" src="assets/basket_icon.svg" style={{ cursor: 'pointer' }} />
          </UiLayout>
        ))
      }

    </div>
  )
}
