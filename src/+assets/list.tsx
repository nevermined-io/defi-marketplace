import type { NextPage } from 'next'
import Image from 'next/image'

import { UiText, UiLayout } from 'ui'
import styles from './list.module.scss'

export const AssetsList: NextPage = () => {
  return (
    <>
      <div className={styles.bannerContainer}>
        <Image src="/assets/nevermined-color.svg" width="115" height="70"/>
        <UiText className={styles.bannerText} wrapper="h1" type="h1">
          The Keyko <br/>
          <UiText clear={['text-transform']}>DeFi</UiText>
          {' '}
          Marketplace
        </UiText>
      </div>

      <UiLayout type="container">
        <UiLayout>
          <UiText type="h3" wrapper="h2">Browse DeFi Projects</UiText>
        </UiLayout>
      </UiLayout>
    </>
  )
}