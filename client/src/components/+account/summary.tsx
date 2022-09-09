import styles from './account.module.scss'
import React from 'react'
import { BEM, UiText, UiLayout } from '@nevermined-io/styles'
import { DDO } from '@nevermined-io/nevermined-sdk-js'

interface SummaryProps {
  published: DDO[]
  bookmarks: DDO[]
  downloaded: DDO[]
  currentSubscription: string
}

const b = BEM('account-modules', styles)
export function Summary({ published, bookmarks, downloaded, currentSubscription }: SummaryProps) {
  return (
    <>
      <UiLayout type="container">
        <UiLayout className={b('summary')}>
          <UiLayout type="container" className={b('card')}>
            <img className={b('card-icon')} src="/assets/subscription-icon.svg" />
            <UiText className={b('card-name')} type="h3" wrapper="h3">
              Your bookmarks
            </UiText>
            <UiText className={b('summary-number')}>{bookmarks.length}</UiText>
          </UiLayout>
          <UiLayout type="container" className={b('card')}>
            <img className={b('card-icon')} src="/assets/published-icon.svg" />
            <UiText className={b('card-name')} type="h3" wrapper="h3">
              Your published assets
            </UiText>
            <UiText className={b('summary-number')}>{published.length}</UiText>
          </UiLayout>
        </UiLayout>
      </UiLayout>
      <UiLayout type="container">
        <UiLayout className={b('summary')}>
          <UiLayout type="container" className={b('card')}>
            <img className={b('card-icon')} src="/assets/purchase-icon.svg" />
            <UiText className={b('card-name')} type="h3" wrapper="h3">
              Your Downloads
            </UiText>
            <UiText className={b('summary-number')}>{downloaded.length}</UiText>
          </UiLayout>
          <UiLayout type="container" className={b('card')}>
            <img className={b('card-icon')} src="/assets/subscription-icon.svg" />
            <UiText className={b('card-name')} type="h3" wrapper="h3">
              Your Subscription
            </UiText>
            {
              currentSubscription ? <UiText className={b('summary-number')}>{currentSubscription}</UiText> : <UiText className={b('summary-number')}>0</UiText>
            }
          </UiLayout>
        </UiLayout>
      </UiLayout>
    </>
  )
}
