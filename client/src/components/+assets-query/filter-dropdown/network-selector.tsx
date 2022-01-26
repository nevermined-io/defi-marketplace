import React, { useContext } from 'react'
import { User } from 'src/context'

import { BEM } from 'ui'
import { UiDivider } from 'ui/divider/divider'

import styles from './filter-dropdown.module.scss'

const b = BEM('filter-dropdown', styles)
const networkArray = ["ETHereum","avalanche","polygon","binance","arbitrum","Fantom"]
export function XuiNetworkSelector() {
    const { fromDate, toDate, setToDate, setFromDate } = useContext(User)


    return <div>
        <h5 className={b('title')}>Network</h5>
        {/* <span className={b('divider')}></span> */}
        <div className={b('network-selector')}>
           
        </div>
    </div>
}
