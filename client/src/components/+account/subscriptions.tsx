import { UiText, UiLayout } from '@nevermined-io/styles'
import { UserSubscription } from '../../shared/constants'
import {SUBSCRIPTION_DURATION_IN_SEGS} from '../../config'
import React, { useEffect, useState } from 'react'

interface SubscriptionsProps {
  purchaseDate: Date | undefined
  currentSubscription: UserSubscription | undefined
}

export function Subscriptions({ purchaseDate, currentSubscription }: SubscriptionsProps) {

  const [endOfSubscription, seteEndOfSubscription] = useState<Date>()

  const calculateEndSubscription = async () => {
    if (currentSubscription && purchaseDate) {
      const endSubscription =new Date(purchaseDate)
      endSubscription.setSeconds(endSubscription.getSeconds() + SUBSCRIPTION_DURATION_IN_SEGS)
      seteEndOfSubscription(endSubscription)
    }

  }

  useEffect(() => {
    calculateEndSubscription()
  }, [])


  return (
    <>
      <UiLayout type="container">
        <UiLayout>
         
          <UiLayout type="container">
            <UiText type="h3" wrapper="h3">
              Your Subscription
            </UiText>
            { 
              currentSubscription && purchaseDate?
              <UiLayout>
                <UiText>{currentSubscription?.tier} </UiText>
                <UiText> - Started: {purchaseDate?.toLocaleDateString()}</UiText>
                <UiText>-  Ends: {endOfSubscription?.toLocaleDateString()}</UiText>
              </UiLayout>
              :<UiText>No Subscription</UiText>
            }
          </UiLayout>
        </UiLayout>
      </UiLayout>
    </>
  )
}
