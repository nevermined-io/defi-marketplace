import React, { useEffect, useContext, useState } from 'react'
import type { NextPage } from 'next'
import { User } from '../context'
import styles from './assets-list.module.scss'
import { BEM, UiText, UiLayout, UiIcon, UiDivider, XuiBuyAsset } from 'ui'
import { getAllUserBundlers, Bundle } from 'src/shared'

const b = BEM('assets-list', styles)
export const History: NextPage = () => {
  const [assets, setAssets] = useState<Bundle[]>([])
  const { sdk, account } = useContext(User)

  useEffect(() => {
    if (!sdk.accounts) {
      return
    }
    loadBundles()
  }, [sdk.accounts])

  const loadBundles = async () => {
    const account = (await sdk.accounts.list())[0]
    const userBundles = await getAllUserBundlers(account.getId())
    setAssets(userBundles)
  }

  return (
    <>
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>History</UiText>
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Reports</UiText>
        </UiLayout>
        {assets.map((asset: Bundle, index: number) => (
          <UiLayout key={asset.did} id={asset.did} className={b('asset')}>
            <UiText className={b('asset-date')} type="small" variants={['detail']}>
              {`Order #${index}`}
            </UiText>
            <UiDivider flex />
            <hr size="40" style={{ border: '1px solid #2B465C', marginRight: '16px' }} />
            <XuiBuyAsset asset={asset.did}>
              <UiIcon icon="download" color="primary" size="l" />
            </XuiBuyAsset>
          </UiLayout>
        ))}
      </UiLayout>
    </>
  )
}
