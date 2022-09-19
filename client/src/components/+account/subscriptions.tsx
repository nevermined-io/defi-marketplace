import { BEM, UiText, UiLayout, UiDivider } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'
import { SUBSCRIPTION_DURATION_IN_SEGS } from '../../config'
import React, { useEffect, useState } from 'react'
import styles from './subscriptions.module.scss'

interface SubscriptionsProps {
  purchaseDate: Date | undefined
  currentSubscription: UserSubscription | undefined
}

const b = BEM('subscriptions', styles)

export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {
  const [endOfSubscription, seteEndOfSubscription] = useState<Date>()

  const calculateEndSubscription = () => {
    if (currentSubscription && purchaseDate) {
      const endSubscription = new Date(purchaseDate)
      endSubscription.setSeconds(endSubscription.getSeconds() + SUBSCRIPTION_DURATION_IN_SEGS)
      seteEndOfSubscription(endSubscription)
    }
  }

  useEffect(() => {
    calculateEndSubscription()
  }, [])

  return (
    <div className={b()}>
      <UiLayout type="container">
        <UiLayout type="container">
          <UiText wrapper="h1" type="h3" variants={['heading']}>
            Your Subscription
          </UiText>
        </UiLayout>
        <UiLayout type="container">
          <UiLayout className={b('asset', ['asset-row-header'])}>
            <UiText type="caps" className={b('info', ['indexer'])} variants={['detail']}>
              subscription type
            </UiText>
            <UiText type="caps" className={b('info', ['info-header'])} variants={['detail']}>
              date start
            </UiText>
            <UiText type="caps" className={b('info', ['info-header'])} variants={['detail']}>
              date valid
            </UiText>
            <UiText type="caps" className={b('info', ['info-header'])} variants={['detail']}>
              price
            </UiText>
            <UiText type="caps" className={b('info', ['price'])} variants={['detail']} />
          </UiLayout>
          <UiDivider />
          {currentSubscription && purchaseDate ? (
            <UiLayout>
              <UiText>{currentSubscription?.tier} </UiText>
              <UiText> - Started: {purchaseDate?.toLocaleDateString()}</UiText>
              <UiText>- Ends: {endOfSubscription?.toLocaleDateString()}</UiText>
            </UiLayout>
          ) : (
            <UiText>No Subscription</UiText>
          )}
        </UiLayout>
      </UiLayout>
    </div>
  )
}
