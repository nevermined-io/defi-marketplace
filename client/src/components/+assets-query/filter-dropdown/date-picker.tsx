import React, { useContext } from 'react'
import { User } from 'src/context'

import { BEM } from 'ui'
import { UiDivider } from 'ui/divider/divider'

import styles from './filter-dropdown.module.scss'

const b = BEM('filter-dropdown', styles)

export function XuiDatePicker() {
    const { fromDate, toDate, setToDate, setFromDate } = useContext(User)


    return <div className={b('filter-container')}>
        <h5 className={b('title')}>Publication Date</h5>
        {/* <span className={b('divider')}></span> */}
        <div className={b('date-pickers')}>
            <span className={b('filters-text')}>From:
                <UiDivider type="s" />
                <input
                    className={b('picker')}
                    onChange={(event) => {
                        setFromDate(event.target.value)
                    }}
                    value={fromDate}
                    type="date"
                /></span>
            <span className={b('filters-text')}>To:
                <UiDivider type="s" />
                <input
                    className={b('picker')}
                    onChange={event => setToDate(event.target.value)}
                    value={toDate}
                    type="date"
                /></span>
        </div>
    </div>
}
