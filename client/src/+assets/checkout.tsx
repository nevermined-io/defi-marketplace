import React, { useContext } from 'react'
import type { NextPage } from 'next'

import { UiText, UiLayout, UiDivider, UiIcon, XuiTokenPrice, XuiTokenName, BEM, UiButton, XuiBuyAsset } from 'ui'
import { User } from '../context'
import { getDdoTokenAddress, getDefiInfo, toDate } from '../shared'
import Link from 'next/link'
import styles from './checkout.module.scss'
import Router from 'next/router'
import { XuiCreateBundle } from 'ui/+create-bundle/create-bundle'

const b = BEM('checkout', styles)
export const Checkout: NextPage = () => {
  const { assets: contextAssets, basket, removeFromBasket } = useContext(User)
  const assets = contextAssets.filter(asset => basket.includes(asset.id))
  const totalPrice = assets.map(
    asset => Number(asset.findServiceByType('metadata').attributes.main.price)
  ).reduce((partialSum, a) => partialSum + a, 0);

  return (
    <>
      <UiLayout justify="flex-start" type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>Shopping Basket</UiText>
        <UiLayout type="sides" align="start">
          <div className={b('purchases-wrapper')}>
            <UiLayout >
              <UiText type="h3" wrapper="h2">My purchases</UiText>
            </UiLayout>
            <hr style={{ borderBottom: '0', borderTop: '1px solid #8AAABE', margin: '22px 0 32px', width: '769px' }}/>

            {/* TODO: make assets-list more versatile and reuse it here */}
            {assets
              .map(asset => ({asset, metadata: asset.findServiceByType('metadata').attributes}))
              .map(data => ({...data, defi: getDefiInfo(data.metadata)}))
              .map(({asset, metadata, defi}) => (
                <div key={asset.id} className={b('table-wrapper')}>
                  <UiLayout className={b('asset')}>
                    <div className={b('checkbox')}>
                      <img onClick={() => removeFromBasket([asset.id])} src={'assets/close.svg'} width="20px" />
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
                  </UiLayout>
                </div>
              ))
            }
          </div>
          <div className={b('order-summary')}>
            <UiText type="h3" wrapper="h2">Order summary</UiText>
            <hr style={{ borderBottom: '0', borderTop: '1px solid #8AAABE', margin: '22px 0 16px', width: '426px' }}/>
            <UiLayout justify="end"><div className={b('items-selected')}>{basket.length} items</div></UiLayout>
            <UiDivider/>
            <UiLayout justify="space-between">
              <UiText type="h4-caps" wrapper="h2">TOTAL</UiText>
              <div className={b('total-price')}><XuiTokenPrice>{totalPrice}</XuiTokenPrice></div>
            </UiLayout>
            <UiDivider/>
            <XuiCreateBundle assets={assets}>
            { assets.length > 0 ? <UiButton cover>Purchase</UiButton> : <></>}
            </XuiCreateBundle>
            <UiDivider/>
            <UiButton cover type="alt " onClick={() => Router.push('/list')}>Back To Marketplace</UiButton>
          </div>
        </UiLayout>
      </UiLayout>
    </>
  )
}
