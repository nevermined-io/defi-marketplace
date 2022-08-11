import React from 'react'
import type { NextPage } from 'next'
import { UiLayout, UiText } from '@nevermined-io/styles'
import { Pricing } from 'ui/+subscription/pricing'


export const Subscription: NextPage = () => {
  const tiers = [
    {
      name: 'Community',
      price: '$0',
      features: [
        'On-chain normalized data from different protocols and networks',
        'Insights dashboards',
        'Integration of basic data with Google Data Studio',
        'Publish reports and notebooks/algorithms without monetization free for the community',
        'Access to community reports'
      ]
    },
    {
      name: 'Analyst',
      price: '$50',
      features: [
        'Tier 1 + Enriched and aggregated datasets',
        'Advanced dashboards',
        'Integration of aggregated data with Google Data Studio',
        'Monetization of reports and notebooks/algorithms',
        'Access to tier 2 reports'
      ]
    },
    {
      name: 'Enterprise',
      price: '$500',
      features: [
        'Tier 2 + Insights and AI on top of the on-chain data',
        'Full access to insights dashboards',
        'Integration of insights reports with Google Data Studio',
        'Monetization of reports and notebooks/algorithms',
        'Access to tier 2 and tier 3 reports'
      ]
    }
  ]

  return (
    <UiLayout type="container">
      <UiLayout>
        <UiText wrapper="h1" type="h1" variants={['heading']}>Subscriptions</UiText>
      </UiLayout>
      <Pricing tiers={tiers} />
    </UiLayout>
  )
}
