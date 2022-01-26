import React from 'react'

import { BEM, UiDivider } from 'ui'
import { XuiDatePicker } from './date-picker'

import styles from './filter-dropdown.module.scss'
import { XuiNetworkSelector } from './network-selector'

interface FilterDropdownProps {
  setFromDate: Function
  setToDate: Function
  fromDate: any
  toDate: any
}

const b = BEM('filter-dropdown', styles)

export function XuiFilterDropdown() {
  // const { setFromDate, setToDate, fromDate, toDate } = props

  return <div className={b('wrapper')}>
    <XuiDatePicker />
    <XuiNetworkSelector />
    

    {/* TODO: implement other filters */}
  </div>
}
