import React from 'react'

import { BEM } from 'ui'
import { UiLayout } from 'ui/layout/layout'
import { XuiDatePicker } from './date-picker'

import styles from './filter-dropdown.module.scss'
import { XuiNetworkSelector } from './network-selector'
import { XuiPriceRangeSelector } from './price-range-selector'

interface FilterDropdownProps {
  setPriceRange: Function
}

const b = BEM('filter-dropdown', styles)

export function XuiFilterDropdown(props: FilterDropdownProps) {

  return <UiLayout type="grid" className={b('wrapper')}>
    <XuiDatePicker />
    <XuiNetworkSelector />
    <XuiPriceRangeSelector setPriceRange={props.setPriceRange}/>

  </UiLayout>
}
