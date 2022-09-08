import styles from './account.module.scss'
import React from 'react'
import { BEM, UiText, UiLayout } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'

interface SubscriptionsProps {
  purchaseDate: Date
  currentSubscription: UserSubscription
}

const b = BEM('account-modules', styles)
export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {
  return (
    <>
      <UiLayout type="container">
        <UiLayout>
         
          <UiLayout type="container">
            <UiText type="h3" wrapper="h3">
              Your Subscription
            </UiText>
            { 
              currentSubscription?
              <UiLayout>
                <UiText className={b('summary-number')}>{currentSubscription?.tier}</UiText>
                <UiText className={b('summary-number')}>{purchaseDate.toISOString().replace(/\.[0-9]{3}/, '')}</UiText>
              </UiLayout>
              :<UiText className={b('summary-number')}>No Subscription</UiText>
            }
          </UiLayout>
        </UiLayout>
      </UiLayout>
    </>
  )
}
