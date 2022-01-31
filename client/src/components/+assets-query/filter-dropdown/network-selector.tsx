import React, { useContext, useEffect, useState } from 'react'

import { BEM } from 'ui'
import { networkArray } from 'src/config'
import styles from './filter-dropdown.module.scss'
import { XuiNetworkBox } from './network-box'

const b = BEM('filter-dropdown', styles)
export function XuiNetworkSelector() {

    return <div className={b('filter-container')}>
        <h5 className={b('title')}>Network</h5>
        <div className={b("network-selector-container")}>
            {networkArray.map((network: string) =>
               <XuiNetworkBox key={network} network={network} />
            )}
        </div>


    </div>
}
