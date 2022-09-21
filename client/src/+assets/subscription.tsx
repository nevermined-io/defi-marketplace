import React from 'react'
import type { NextPage } from 'next'
import { UiLayout, UiText } from '@nevermined-io/styles'
import { Pricing } from 'ui/+subscription/pricing'
import { User } from '../context'

export const Subscription: NextPage = () => {
  const { tiers } = React.useContext(User)

  return (
    <UiLayout type="container">
      <UiLayout>
        <UiText wrapper="h1" type="h1" variants={['heading']}>
          Subscriptions
        </UiText>
      </UiLayout>
      <Pricing tiers={tiers} />
    </UiLayout>
  )
}
