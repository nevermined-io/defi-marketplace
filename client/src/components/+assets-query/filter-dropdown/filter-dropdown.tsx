import React from 'react'

import { BEM, UiLayout } from '@nevermined-io/styles'
import { XuiDatePicker } from './date-picker'

import styles from './filter-dropdown.module.scss'
import { XuiNetworkSelector } from './network-selector'
import { XuiTypeSelector } from './type-selector'
import { XuiSubscriptionSelector } from './subscription-selector'

interface FilterDropdownProps {
  setPriceRange: (price: number) => void
}

const b = BEM('filter-dropdown', styles)

export function XuiFilterDropdown(props: FilterDropdownProps) {
  return (
    <UiLayout type="grid" className={b('wrapper')}>
      <XuiDatePicker />
      <XuiNetworkSelector />
      <XuiTypeSelector />
      <XuiSubscriptionSelector />
    </UiLayout>
  )
}
