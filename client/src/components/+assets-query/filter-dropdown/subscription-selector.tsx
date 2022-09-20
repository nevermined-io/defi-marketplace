import React from 'react'

import { BEM } from '@nevermined-io/styles'
import { NFT_TIERS } from 'src/config'
import styles from './filter-dropdown.module.scss'
import { XuiSubscriptionBox } from './subscription-box'

const b = BEM('filter-dropdown', styles)
export function XuiSubscriptionSelector() {
  return (
    <div className={b('filter-container')}>
      <h5 className={b('title')}>Subscription</h5>
      <div className={b('network-selector-container')}>
        {NFT_TIERS.map((subscription) => (
          <XuiSubscriptionBox key={subscription.name} subscription={subscription.name} />
        ))}
      </div>
    </div>
  )
}
