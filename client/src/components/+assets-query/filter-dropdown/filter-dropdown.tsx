import React, { useContext } from 'react'
import { BEM, UiLayout } from '@nevermined-io/styles'
import { XuiDatePicker } from './date-picker'
import styles from './filter-dropdown.module.scss'
import { XuiNetworkSelector } from './network-selector'
import { XuiTypeSelector } from './type-selector'
import { XuiSubscriptionSelector } from './subscription-selector'
import { User } from 'src/context'

const b = BEM('filter-dropdown', styles)

export function XuiFilterDropdown() {
  const { clearDropdownFilters, applyDropdownFilters } = useContext(User)

  return (
    <UiLayout type="grid" className={b('wrapper')}>
      <div className={b('controls')}>
        <XuiNetworkSelector />
        <XuiSubscriptionSelector />
        <XuiTypeSelector />
        <XuiDatePicker />
      </div>
      <div className={b('buttons')}>
        <button className={b('button', ['clear'])} onClick={clearDropdownFilters}>
          Clear
        </button>
        <button className={b('button', ['apply'])} onClick={applyDropdownFilters}>
          Apply Filters
        </button>
      </div>
    </UiLayout>
  )
}
