import styles from './account.module.scss'
import React from 'react'
import { BEM, UiText, UiLayout } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'
import {SUBSCRIPTION_DURATION_IN_SEGS} from '../../config'

interface SubscriptionsProps {
  purchaseDate: Date
  currentSubscription: UserSubscription | undefined
}

const b = BEM('account-modules', styles)
export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {

  let endOfSubscription: Date = new Date(purchaseDate)
  endOfSubscription.setSeconds(endOfSubscription.getSeconds() + SUBSCRIPTION_DURATION_IN_SEGS)


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
                <UiText>{currentSubscription?.tier} </UiText>
                <UiText> - Started: {purchaseDate.toLocaleDateString()}</UiText>
                <UiText>-  Ends: {endOfSubscription.toLocaleDateString()}</UiText>
              </UiLayout>
              :<UiText>No Subscription</UiText>
            }
          </UiLayout>
        </UiLayout>
      </UiLayout>
    </>
  )
}
