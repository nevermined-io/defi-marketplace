import type { NextPage } from 'next'
import Image from 'next/image'

import { UiText } from 'ui'
import styles from './list.module.scss'

const Page: NextPage = () => {
  return (
    <>
      <div className={styles.bannerContainer}>
        <img src="/assets/nevermined-color.svg"/>
        <UiText className={styles.bannerText} wrapper="h1" type="h1">
          The Keyko <br/> <UiText clear={['text-transform']}>DeFi</UiText> Marketplace
        </UiText>
      </div>
    </>
  )
}

export default Page
