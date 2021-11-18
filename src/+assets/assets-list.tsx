import React, { Props } from 'react'
import { DDO } from '@nevermined-io/nevermined-sdk-js'
import Link from "next/link"

import { BEM, UiLayout, UiText, UiDivider, UiIcon, XuiTokenName, XuiTokenPrice, XuiBuyAsset } from 'ui'
import { toDate, getDefiInfo, getDdoTokenAddress } from '../shared'
import styles from './assets-list.module.scss'

interface AssetsListProps {
  assets: DDO[]
}

const b = BEM('assets-list', styles)
export function AssetsList({assets}: AssetsListProps) {
  return (
    <div className={b()}>
      {assets
        .map(asset => ({asset, metadata: asset.findServiceByType('metadata').attributes}))
        .map(data => ({...data, defi: getDefiInfo(data.metadata)}))
        .map(({asset, metadata, defi}) => (
          <UiLayout key={asset.id} className={b('asset')}>
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
            <XuiBuyAsset asset={asset}>
              <UiIcon icon="download" color="primary" size="l"/>
            </XuiBuyAsset>
          </UiLayout>
        ))
      }

    </div>
  )
}
