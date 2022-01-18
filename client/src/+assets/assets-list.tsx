import React, { Fragment, useContext, useState } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import Link from "next/link"
import Router from 'next/router'

import { BEM, UiLayout, UiText, UiDivider, UiIcon, XuiTokenName, XuiTokenPrice, XuiBuyAsset } from 'ui'
import { toDate, getDefiInfo, getDdoTokenAddress } from '../shared'
import styles from './assets-list.module.scss'
import { User } from '../context'

interface AssetsListProps {
  assets: DDO[]
}

const b = BEM('assets-list', styles)
export function AssetsList({assets}: AssetsListProps) {
  const { addToBasket, basket } = useContext(User)
  const [batchActive, setBatchActive] = useState<boolean>(false)
  const [batchSelected, setBatchSelected] = useState<string[]>([])

  const addToBatchSelected = (dids: string[]) => setBatchSelected(prevSelected =>
    prevSelected.concat(dids.filter(did => !prevSelected.includes(did)))
  )

  const removeFromBatchSelected = (dids: string[]) => {
    const didsSet = new Set(dids)
    setBatchSelected(prevSelected => prevSelected.filter(did => !didsSet.has(did)))
  }

  return (
    <div className={b()}>
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
              <div className={b('basket-add')} onClick={() => addToBasket(batchSelected)}>Add to basket</div>
            </Fragment> :
            <div className={b('batch-select-inactive')} onClick={() => setBatchActive(true)}>Batch Select</div>
          }
          <div className={b('basket-add')} onClick={() => Router.push('/checkout')}>Checkout</div>
          {basket.length}
        </div>
      </div>
      {assets
        .map(asset => ({asset, metadata: asset.findServiceByType('metadata').attributes}))
        .map(data => ({...data, defi: getDefiInfo(data.metadata)}))
        .map(({asset, metadata, defi}) => (
          <UiLayout key={asset.id} className={b('asset')}>
            <div className={b(`${batchActive ? 'checkbox' : 'checkbox--hidden'}`)}>
              {batchSelected.includes(asset.id) ?
                <img onClick={() => removeFromBatchSelected([asset.id])} src={'assets/checked_box.svg'} width="20px" /> :
                <img onClick={() => addToBatchSelected([asset.id])} src={'assets/unchecked_box.svg'} width="20px" />
              }
            </div>
            <Link href={`/asset/${asset.id}`}>
              <UiText className={`pointer ${b('asset-title')}`} wrapper="h4" type="h4">{metadata.main.name}</UiText>
            </Link>
            <UiText className={b('asset-date')} type="small" variants={['detail']}>
              {toDate(metadata.main.dateCreated).replace(/\//g, '.')}
            </UiText>
            <UiDivider flex/>
            {defi?.category && defi?.network && (
              <>
                <UiLayout className={b('info')}>
                  <UiIcon className={b('info-icon')} icon="folder" color="secondary"/>
                  <UiText variants={['secondary']}>{defi.category}</UiText>
                  <UiText variants={['detail']}>&nbsp;&ndash;&nbsp;</UiText>
                  <UiText variants={['secondary']}>{defi.subcategory}</UiText>
                </UiLayout>
                <UiLayout className={b('info')}>
                  <UiIcon className={b('info-icon')} icon="share" color="secondary"/>
                  <UiText variants={['secondary']}>{defi.network}</UiText>
                </UiLayout>
              </>
            )}
            <UiLayout className={b('info')}>
              <UiIcon className={b('info-icon')} icon="tag" color="secondary"/>
              <UiText variants={['secondary']}>
                <XuiTokenPrice>{metadata.main.price}</XuiTokenPrice>
                {' '}
                <UiText variants={['detail']}>
                  <XuiTokenName address={getDdoTokenAddress(asset)}/>
                </UiText>
              </UiText>
            </UiLayout>
            <hr size="40" style={{ border: '1px solid #2B465C', marginRight: '16px' }}/>
            <img onClick={() => addToBasket([asset.id])} width="24px" src="assets/basket_icon.svg" style={{ cursor: 'pointer' }}/>
          </UiLayout>
        ))
      }

    </div>
  )
}
