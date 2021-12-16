import React from 'react'

import { BEM } from 'ui'

import styles from './filter-dropdown.module.scss'

interface FilterDropdownProps {
  setFromDate: Function
  setToDate: Function
  fromDate: any
  toDate: any
}

const b = BEM('filter-dropdown', styles)

export function XuiFilterDropdown(props: FilterDropdownProps) {
  const { setFromDate, setToDate, fromDate, toDate } = props

  return <div className={b('wrapper')}>
    <div>
      <h3 className={b('title')}>PUBLICATION DATE</h3>
      <div className={b('date-pickers')}>
      <span>From: <input
        onChange={(event) => {
          setFromDate(event.target.value)
        }}
        value={fromDate}
        style={{ background: '#FEFEFE', fontFamily: 'Ubuntu' }}
        type="date"
      /></span>
        <span>To: <input
          onChange={event => setToDate(event.target.value)}
          style={{ background: '#FEFEFE', fontFamily: 'Ubuntu' }}
          value={toDate}
          type="date"
        /></span>
      </div>
    </div>
    {/* TODO: implement other filters */}
    {/*<div style={{borderLeft: '1px solid #FEFEFE', height: '50px'}}></div>*/}
    {/*<h3 className={b('title')}>PUBLICATION DATE</h3>*/}
    {/*<div className={b('date-pickers')}>*/}
    {/*  <span>From: <input style={{background: '#FEFEFE', fontFamily: 'Ubuntu'}} type="date"/></span>*/}
    {/*  <span>To: <input style={{background: '#FEFEFE', fontFamily: 'Ubuntu'}} type="date"/></span>*/}
    {/*</div>*/}
  </div>
}
